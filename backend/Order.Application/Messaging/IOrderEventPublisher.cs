namespace Order.Application.Messaging;

public interface IOrderEventPublisher
{
    Task PublishOrderCreatedAsync(Guid orderId);
}
