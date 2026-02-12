using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Order.Domain.Enums;
using Order.Domain.Entities;
using Order.Infrastructure.Persistence;

namespace Order.Worker.Consumers;

public class OrderCreatedConsumer : BackgroundService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<OrderCreatedConsumer> _logger;
    private readonly IServiceProvider _serviceProvider;

    private ServiceBusClient? _client;
    private ServiceBusProcessor? _processor;

    public OrderCreatedConsumer(
        IConfiguration configuration,
        ILogger<OrderCreatedConsumer> logger,
        IServiceProvider serviceProvider)
    {
        _configuration = configuration;
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var connectionString = _configuration["ServiceBus:ConnectionString"];
        var queueName = _configuration["ServiceBus:QueueName"];

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("ServiceBus:ConnectionString não configurado.");

        if (string.IsNullOrWhiteSpace(queueName))
            throw new InvalidOperationException("ServiceBus:QueueName não configurado.");

        _client = new ServiceBusClient(connectionString);

        _processor = _client.CreateProcessor(queueName, new ServiceBusProcessorOptions
        {
            AutoCompleteMessages = false,
            MaxConcurrentCalls = 1
        });

        _processor.ProcessMessageAsync += MessageHandler;
        _processor.ProcessErrorAsync += ErrorHandler;

        _logger.LogInformation("🚀 Worker iniciado. Escutando fila: {QueueName}", queueName);

        await _processor.StartProcessingAsync(stoppingToken);
    }

    private async Task MessageHandler(ProcessMessageEventArgs args)
    {
        try
        {
            var body = args.Message.Body.ToString();

            _logger.LogInformation("📩 Pedido recebido da fila: {Body}", body);
            _logger.LogInformation(
                "CorrelationId: {CorrelationId} | EventType: {EventType}",
                args.Message.CorrelationId,
                args.Message.Subject);

            var message = System.Text.Json.JsonSerializer.Deserialize<OrderCreatedMessage>(body);

            if (message == null)
            {
                _logger.LogWarning("Mensagem inválida. Enviando para DeadLetter.");
                await args.DeadLetterMessageAsync(args.Message, "InvalidMessage", "Body inválido.");
                return;
            }

            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var order = await dbContext.Orders.FindAsync(message.OrderId);

            if (order == null)
            {
                _logger.LogWarning("Pedido {OrderId} não encontrado. Ignorando.", message.OrderId);
                await args.CompleteMessageAsync(args.Message);
                return;
            }

            // ✅ Idempotência
            if (order.Status != OrderStatus.Pending)
            {
                _logger.LogInformation(
                    "♻️ Pedido {OrderId} já processado ({Status}). Ignorando.",
                    order.Id,
                    order.Status);

                await args.CompleteMessageAsync(args.Message);
                return;
            }

            var correlationId = args.Message.CorrelationId ?? order.Id.ToString();

            // ==============================
            // 🔄 TRANSIÇÃO: Pending -> Processing
            // ==============================
            var fromProcessing = order.Status;

            order.MarkAsProcessing();

            dbContext.OrderStatusHistory.Add(new OrderStatusHistory(
                order.Id,
                fromProcessing,
                order.Status,
                "Worker",
                correlationId
            ));

            await dbContext.SaveChangesAsync();

            _logger.LogInformation("🔄 Pedido {OrderId} em processamento...", order.Id);

            // Simulação de processamento
            await Task.Delay(5000);

            // ==============================
            // ✅ TRANSIÇÃO: Processing -> Finished
            // ==============================
            var fromFinished = order.Status;

            order.MarkAsFinished();

            dbContext.OrderStatusHistory.Add(new OrderStatusHistory(
                order.Id,
                fromFinished,
                order.Status,
                "Worker",
                correlationId
            ));

            await dbContext.SaveChangesAsync();

            _logger.LogInformation("✅ Pedido {OrderId} finalizado!", order.Id);

            await args.CompleteMessageAsync(args.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar mensagem. Retry será aplicado pelo Service Bus.");
            throw;
        }
    }

    private Task ErrorHandler(ProcessErrorEventArgs args)
    {
        _logger.LogError(args.Exception,
            "Erro no ServiceBusProcessor | Entity: {EntityPath} | ErrorSource: {ErrorSource} | Namespace: {FullyQualifiedNamespace}",
            args.EntityPath,
            args.ErrorSource,
            args.FullyQualifiedNamespace);

        return Task.CompletedTask;
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("🛑 Encerrando Worker...");

        if (_processor != null)
        {
            await _processor.StopProcessingAsync(cancellationToken);
            await _processor.DisposeAsync();
        }

        if (_client != null)
        {
            await _client.DisposeAsync();
        }

        await base.StopAsync(cancellationToken);
    }

    private sealed class OrderCreatedMessage
    {
        public Guid OrderId { get; set; }
    }
}
