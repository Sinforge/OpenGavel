namespace BlockchainService.Contracts;

public sealed record GetAuctionLogsRequest(
    int ChainId,
    string Address);