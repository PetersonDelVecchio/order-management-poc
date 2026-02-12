using Microsoft.EntityFrameworkCore;
using Order.Infrastructure.Persistence;
using Order.Domain.Repositories;
using Order.Infrastructure.Repositories;
using Order.Application.Services;
using Order.Application.Messaging;
using Order.Infrastructure.Messaging;
using HealthChecks.AzureServiceBus;

var builder = WebApplication.CreateBuilder(args);

// ================= CORS =================
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
// ========================================

// HealthChecks
builder.Services.AddHealthChecks()
    .AddNpgSql(
        builder.Configuration.GetConnectionString("DefaultConnection")!,
        name: "postgresql")
    .AddAzureServiceBusQueue(
        builder.Configuration["ServiceBus:ConnectionString"]!,
        builder.Configuration["ServiceBus:QueueName"]!,
        name: "servicebus");

// Swagger + Controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// DI: Repository + Service
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<OrderService>();

// DI: Publisher (ServiceBus)
builder.Services.AddScoped<IOrderEventPublisher>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var connectionString = configuration["ServiceBus:ConnectionString"];
    var queueName = configuration["ServiceBus:QueueName"];

    return new ServiceBusOrderEventPublisher(connectionString!, queueName!);
});

var app = builder.Build();

// ================= CORS =================
app.UseCors("Frontend");
// ========================================

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Endpoints
app.MapControllers();
app.MapHealthChecks("/health");

// (Opcional) endpoint padrão do template - pode remover depois
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Migrations automáticas (vai rodar ao subir a API)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
