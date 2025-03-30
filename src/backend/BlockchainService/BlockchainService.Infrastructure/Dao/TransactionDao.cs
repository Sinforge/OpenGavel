namespace BlockchainService.Infrastructure.Dao;

public class TransactionDao
{
    public Guid AuctionId { get; }
    
    public string Hash { get;}
    
    
    public TransactionDao(Guid auctionId, string hash)
    {
        Hash = hash;
        AuctionId = auctionId;
    }
}