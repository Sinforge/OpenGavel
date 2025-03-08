using DomainCore;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;

namespace LotService.Domain.Entities;

public abstract class BaseAuction : Entity<Guid>
{
    public BlockchainAddress ContractAddress { get; }
    
    public BlockchainAddress OwnerAddress { get; }
    
    public AuctionType Type { get; }

    public string Title { get; }
    
    public string Description { get; }

    public DateTime StartTime { get; }

    public DateTime EndTime { get; }
    
    protected BaseAuction(Guid id, BlockchainAddress contractAddress, BlockchainAddress ownerAddress, AuctionType type, 
        string title, string description, DateTime startTime, DateTime endTime)
        : base(id)
    {
        ContractAddress = contractAddress;
        OwnerAddress = ownerAddress;
        Type = type;
        Title = title;
        Description = description;
        StartTime = startTime;
        EndTime = endTime;
    }
    protected BaseAuction(BlockchainAddress contractAddress, BlockchainAddress ownerAddress, AuctionType type, 
        string title, string description, DateTime startTime, DateTime endTime)
        : base(Guid.NewGuid())
    {
        ContractAddress = contractAddress;
        OwnerAddress = ownerAddress;
        Type = type;
        Title = title;
        Description = description;
        StartTime = startTime;
        EndTime = endTime;
    }
    
}