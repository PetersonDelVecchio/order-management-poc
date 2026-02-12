using Microsoft.EntityFrameworkCore;
using Order.Domain.Repositories;
using Order.Infrastructure.Persistence;
using OrderEntity = Order.Domain.Entities.Order;

namespace Order.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(OrderEntity order)
    {
        await _context.Orders.AddAsync(order);
    }

    public async Task<OrderEntity?> GetByIdAsync(Guid id)
    {
        return await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<List<OrderEntity>> GetAllAsync()
    {
        return await _context.Orders.ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
    public async Task<List<Order.Domain.Entities.OrderStatusHistory>> GetHistoryAsync(Guid orderId)
{
    return await _context.OrderStatusHistory
        .Where(h => h.OrderId == orderId)
        .OrderBy(h => h.ChangedAt)
        .ToListAsync();
}

}
