namespace LotService.TransactionWorker.Models;

internal record PublishAuctionParams(
    Guid AuctionId,
    string ContractAddress
    );