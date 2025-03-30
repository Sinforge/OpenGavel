namespace LotService.TransactionWorker.Kafka.Messages;

public record CompletedTransactionMessage(
    long Id,
    Guid AuctionId,
    string ContractAddress
);