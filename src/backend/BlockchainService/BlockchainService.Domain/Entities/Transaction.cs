using DomainCore;

namespace BlockchainService.Domain.Entities;

public class Transaction : Entity<long>
{
    public string Hash { get;}
    
    public Guid AuctionId { get; }

    public DateTime CreatedAt { get; }
    
    private Transaction(long id, string hash, Guid auctionId, DateTime createdAt) : base(id)
    {
        Hash = hash;
        AuctionId = auctionId;
        CreatedAt = createdAt;
    }

    public static Transaction Create(long id, string hash, Guid auctionId, DateTime createdAt)
        => new(id, hash, auctionId, createdAt);
    
    public static Transaction Create(string hash, Guid auctionId, DateTime createdAt)
        => new(0, hash, auctionId, createdAt);
}