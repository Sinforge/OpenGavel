using LotService.Application.Dto;
using LotService.Domain.Enums;
using MediatR;

namespace LotService.Application.Handlers.Queries.GetAuctions;

public sealed record GetAuctionsQuery(
    long Offset,
    long Limit,
    AuctionType? Type,
    string? Name, 
    int? ChainId,
    DateTime? StartDate,
    DateTime? EndDate,
    bool IncludeClosed
    ) : IRequest<PagedResult<GetAuctionsDto>>;