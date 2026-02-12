using Microsoft.AspNetCore.Mvc;
using Order.API.DTOs;
using Order.Application.Services;

namespace Order.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
   public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)

    {
        var id = await _orderService.CreateOrderAsync(
            request.Customer,
            request.Product,
            request.Amount
        );

        return CreatedAtAction(nameof(GetById), new { id }, new { id });

    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }
     [HttpGet("{id}")]
public async Task<IActionResult> GetById(Guid id)
{
    var order = await _orderService.GetOrderByIdAsync(id);
    if (order == null) return NotFound();

    var history = await _orderService.GetOrderHistoryAsync(id);

    var response = new OrderDetailsResponse(
        order.Id,
        order.Customer,
        order.Product,
        order.Amount,
        (int)order.Status,
        order.CreatedAt,
        history.Select(h => new OrderHistoryItem(
            (int)h.FromStatus,
            (int)h.ToStatus,
            h.ChangedAt,
            h.Source,
            h.CorrelationId
        )).ToList()
    );

    return Ok(response);
    }
}
