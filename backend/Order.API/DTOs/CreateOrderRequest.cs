namespace Order.API.DTOs;

public class CreateOrderRequest
{
    public string Customer { get; set; } = default!;
    public string Product { get; set; } = default!;
    public decimal Amount { get; set; }
}
