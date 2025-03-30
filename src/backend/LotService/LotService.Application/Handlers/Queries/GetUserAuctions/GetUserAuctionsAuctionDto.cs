using LotService.Domain.Enums;

namespace LotService.Application.Handlers.Queries.GetUserAuctions;

public sealed record GetUserAuctionsAuctionDto(
    Guid Id,
    string? ContractAddress,
    string Title,
    AuctionStatus Status,
    AuctionType Type
);