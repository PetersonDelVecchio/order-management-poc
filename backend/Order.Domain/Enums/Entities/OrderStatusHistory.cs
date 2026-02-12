using Order.Domain.Enums;

namespace Order.Domain.Entities;

public class OrderStatusHistory
{
    public Guid Id { get; private set; }
    public Guid OrderId { get; private set; }

    public OrderStatus FromStatus { get; private set; }
    public OrderStatus ToStatus { get; private set; }

    public DateTime ChangedAt { get; private set; }

    // Quem gerou a mudança: "API" ou "Worker"
    public string Source { get; private set; } = default!;

    // Para rastrear ponta-a-ponta (usar OrderId)
    public string CorrelationId { get; private set; } = default!;

    protected OrderStatusHistory() { }

    public OrderStatusHistory(
        Guid orderId,
        OrderStatus fromStatus,
        OrderStatus toStatus,
        string source,
        string correlationId)
    {
        Id = Guid.NewGuid();
        OrderId = orderId;
        FromStatus = fromStatus;
        ToStatus = toStatus;
        Source = source;
        CorrelationId = correlationId;
        ChangedAt = DateTime.UtcNow;
    }
}
