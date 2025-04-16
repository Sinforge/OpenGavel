namespace LotService.Application.Dto;

public sealed record PagedResult<T>(IReadOnlyCollection<T> Items, long TotalCount);