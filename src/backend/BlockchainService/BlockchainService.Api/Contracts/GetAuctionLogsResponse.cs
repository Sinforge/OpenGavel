namespace BlockchainService.Contracts;

public sealed record GetAuctionLogsResponse(
    string Status,
    string Message,
    LogDto[] Result
);

public sealed record LogDto(
    string Address,
    string[] Topics,
    string Data,
    string BlockNumber,
    string TimeStamp,
    string GasPrice,
    string GasUsed,
    string LogIndex,
    string TransactionHash,
    string TransactionIndex
);