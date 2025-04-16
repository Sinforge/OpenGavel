using LotService.Domain.Enums;

namespace LotService.Application.Handlers.Queries.GetAuctions;

public sealed record GetAuctionsDto(
    Guid Id,
    string ContractAddress,
    ChainId ChainId,
    string OwnerAddress,
    string Title,
    string Description,
    bool IsClosed,
    AuctionType Type
);