using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Order.Infrastructure.Persistence;
using Order.Worker.Consumers;

var builder = Host.CreateApplicationBuilder(args);

// Logging (já vem, mas deixo explícito)
builder.Services.AddLogging();

// DbContext (PostgreSQL)
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var conn = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(conn);
});

// Hosted Service (Consumer do Service Bus)
builder.Services.AddHostedService<OrderCreatedConsumer>();

var app = builder.Build();
app.Run();
