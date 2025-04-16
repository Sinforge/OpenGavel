using DomainCore;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;

namespace LotService.Domain.Entities;

public sealed class Auction : Entity<Guid>
{
    public BlockchainAddress OwnerAddress { get; private set; }
    public DeployedContract? DeployedContract { get; private set; }
    public DateTimeRange DateRange { get; private set; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public object Configuration { get; private set; }
    public AuctionStatus Status { get; private set; }
    public AuctionType Type { get; private set; }

    private Auction(Guid id, BlockchainAddress ownerAddress,
        DeployedContract? deployedContract, string title,
        string description, object configuration, AuctionStatus status, AuctionType type, DateTimeRange dateRange) 
        : base(id)
    {
        OwnerAddress = ownerAddress;
        DeployedContract = deployedContract;
        Title = title;
        DateRange = dateRange;
        Description = description;
        Configuration = configuration;
        Status = status;
        Type = type;
    }
    
    public void SetDeployedContract(DeployedContract deployedContract) => DeployedContract = deployedContract;
    
    public static Auction Create(Guid id, BlockchainAddress ownerAddress,
        DeployedContract? deployedContract, string title,
        string description, object configuration, AuctionStatus status, AuctionType type, DateTimeRange dateRange)
        => new (id, ownerAddress, deployedContract, title, description, configuration, status, type, dateRange);

    public static Auction Create(BlockchainAddress ownerAddress, DeployedContract? deployedContract,
        string title, string description,
        object configuration, AuctionStatus status, AuctionType type, DateTimeRange dateRange)
        => new(Guid.NewGuid(), ownerAddress, deployedContract, title, description, configuration, status, type, dateRange);
}