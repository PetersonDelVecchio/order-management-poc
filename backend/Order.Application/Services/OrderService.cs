using Order.Domain.Repositories;
using OrderEntity = Order.Domain.Entities.Order;
using Order.Application.Messaging;

namespace Order.Application.Services;

public class OrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderEventPublisher _eventPublisher;

    public OrderService(IOrderRepository orderRepository, IOrderEventPublisher eventPublisher)
    {
        _orderRepository = orderRepository;
        _eventPublisher = eventPublisher;
    }

    public async Task<Guid> CreateOrderAsync(string customer, string product, decimal amount)
    {
        var order = new OrderEntity(customer, product, amount);

        await _orderRepository.AddAsync(order);
        await _orderRepository.SaveChangesAsync();

        await _eventPublisher.PublishOrderCreatedAsync(order.Id);

        return order.Id;
    }

    public async Task<List<OrderEntity>> GetAllOrdersAsync()
    {
        return await _orderRepository.GetAllAsync();
    }

    public async Task<OrderEntity?> GetOrderByIdAsync(Guid id)
    {
        return await _orderRepository.GetByIdAsync(id);
    }
    public async Task<List<Order.Domain.Entities.OrderStatusHistory>> GetOrderHistoryAsync(Guid id)
{
    return await _orderRepository.GetHistoryAsync(id);
}

}
