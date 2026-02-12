namespace Order.API.DTOs;

public record OrderHistoryItem(
    int FromStatus,
    int ToStatus,
    DateTime ChangedAt,
    string Source,
    string CorrelationId
);

public record OrderDetailsResponse(
    Guid Id,
    string Customer,
    string Product,
    decimal Amount,
    int Status,
    DateTime CreatedAt,
    List<OrderHistoryItem> History
);
