using Order.Domain.Enums;

namespace Order.Domain.Entities;

public class Order
{
    public Guid Id { get; private set; }
    public string Customer { get; private set; } = default!;
    public string Product { get; private set; } = default!;
    public decimal Amount { get; private set; }
    public OrderStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }

    protected Order() { } // EF Core

    public Order(string customer, string product, decimal amount)
    {
        Id = Guid.NewGuid();
        Customer = customer;
        Product = product;
        Amount = amount;
        Status = OrderStatus.Pending;
        CreatedAt = DateTime.UtcNow;
    }

    public void MarkAsProcessing()
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException("Order must be Pending to be processed.");

        Status = OrderStatus.Processing;
    }

    public void MarkAsFinished()
    {
        if (Status != OrderStatus.Processing)
            throw new InvalidOperationException("Order must be Processing to be finished.");

        Status = OrderStatus.Finished;
    }
}