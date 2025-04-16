using LotService.Application.Dto;
using LotService.Domain.Enums;
using MediatR;

namespace LotService.Application.Handlers.Queries.GetAuctions;

public sealed record GetAuctionsQuery(
    long Offset,
    long Limit,
    AuctionType? Type,
    string? Name, 
    DateTime? StartDate,
    DateTime? EndDate,
    DateTime? StartTime,
    bool IncludeClosed
    ) : IRequest<PagedResult<GetAuctionsDto>>;