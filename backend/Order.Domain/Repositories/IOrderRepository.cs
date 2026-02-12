using OrderEntity = Order.Domain.Entities.Order;

namespace Order.Domain.Repositories;

public interface IOrderRepository
{
    Task AddAsync(OrderEntity order);
    Task<OrderEntity?> GetByIdAsync(Guid id);
    Task<List<OrderEntity>> GetAllAsync();
    Task SaveChangesAsync();
    Task<List<Order.Domain.Entities.OrderStatusHistory>> GetHistoryAsync(Guid orderId);

}
