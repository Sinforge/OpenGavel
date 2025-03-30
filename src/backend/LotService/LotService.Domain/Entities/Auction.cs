using DomainCore;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;

namespace LotService.Domain.Entities;

public sealed class Auction : Entity<Guid>
{
    public BlockchainAddress OwnerAddress { get; private set; }
    public BlockchainAddress? ContractAddress { get; private set; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public object Configuration { get; private set; }
    public AuctionStatus Status { get; private set; }
    public AuctionType Type { get; private set; }

    private Auction(Guid id, BlockchainAddress ownerAddress,
        BlockchainAddress? contractAddress, string title,
        string description, object configuration, AuctionStatus status, AuctionType type) 
        : base(id)
    {
        OwnerAddress = ownerAddress;
        ContractAddress = contractAddress;
        Title = title;
        Description = description;
        Configuration = configuration;
        Status = status;
        Type = type;
    }
    
    public static Auction Create(Guid id, BlockchainAddress ownerAddress,
        BlockchainAddress? contractAddress, string title,
        string description, object configuration, AuctionStatus status, AuctionType type)
        => new (id, ownerAddress, contractAddress, title, description, configuration, status, type);

    public static Auction Create(BlockchainAddress ownerAddress, BlockchainAddress? contractAddress,
        string title, string description,
        object configuration, AuctionStatus status, AuctionType type)
        => new(Guid.NewGuid(), ownerAddress, contractAddress, title, description, configuration, status, type);
}