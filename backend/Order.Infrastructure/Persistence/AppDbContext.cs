using Microsoft.EntityFrameworkCore;
using OrderEntity = Order.Domain.Entities.Order;

namespace Order.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
public DbSet<Order.Domain.Entities.OrderStatusHistory> OrderStatusHistory => Set<Order.Domain.Entities.OrderStatusHistory>();

   public DbSet<OrderEntity> Orders => Set<OrderEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order.Domain.Entities.OrderStatusHistory>(entity =>
{
    entity.HasKey(h => h.Id);

    entity.Property(h => h.Source)
        .IsRequired()
        .HasMaxLength(50);

    entity.Property(h => h.CorrelationId)
        .IsRequired()
        .HasMaxLength(200);

    entity.Property(h => h.ChangedAt)
        .IsRequired();

    entity.HasIndex(h => h.OrderId);
});

        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<OrderEntity>(entity =>
        {
            entity.HasKey(o => o.Id);

            entity.Property(o => o.Customer)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(o => o.Product)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(o => o.Amount)
                .HasPrecision(18, 2);

            entity.Property(o => o.Status)
                .IsRequired();

            entity.Property(o => o.CreatedAt)
                .IsRequired();
        });
    }
}
