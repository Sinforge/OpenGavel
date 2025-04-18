using LotService.Domain.Enums;

namespace LotService.Application.Repositories.Models;

public sealed record GetPagedAuctionsQuery(
    long Offset,
    long Limit,
    AuctionType? Type,
    string? Name,
    int? ChainId,
    DateTime? StartDateTime,
    DateTime? EndDateTime,
    bool IncludeClosed);