using LotService.Domain.Enums;

namespace LotService.Application.Handlers.Queries.GetAuctionInfo.Models;

public record AuctionInfo(
    string OwnerAddress,
    string ContractAddress,
    ChainId ChainId,
    DateTime StartTime,
    DateTime EndTime,
    string Title,
    string Description,
    object Configuration,
    AuctionStatus Status,
    AuctionType Type
);