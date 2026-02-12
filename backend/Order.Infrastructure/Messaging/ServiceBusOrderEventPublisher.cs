using Azure.Messaging.ServiceBus;
using Order.Application.Messaging;
using System.Text;
using System.Text.Json;

namespace Order.Infrastructure.Messaging;

public class ServiceBusOrderEventPublisher : IOrderEventPublisher
{
    private readonly ServiceBusClient _client;
    private readonly string _queueName;
    private readonly ServiceBusSender _sender;


    public ServiceBusOrderEventPublisher(string connectionString, string queueName)
    {
        _client = new ServiceBusClient(connectionString);
        _queueName = queueName;
        _sender = _client.CreateSender(_queueName);

    }

    public async Task PublishOrderCreatedAsync(Guid orderId)
{
    var messageBody = JsonSerializer.Serialize(new
    {
        OrderId = orderId
    });

    var message = new ServiceBusMessage(messageBody)
    {
        CorrelationId = orderId.ToString(),   // 🔥 Rastreabilidade
        Subject = "OrderCreated"              // 🔥 EventType
    };

    await _sender.SendMessageAsync(message);
}

}
