using LotService.Domain.Entities;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;

namespace LotService.Infrastructure.Dao;

public sealed class AuctionDao
{
    public Guid Id { get; init; }
    public string OwnerAddress { get; init; }
    public string? ContractAddress { get; init; }
    public string Title { get; init; }
    public string Description { get; init; }
    public string Configuration { get; init; }
    public int Status { get; init; }
    public int Type { get; init; }
    
    public Auction ToDomain()
        => Auction.Create(
            Id,
            BlockchainAddress.Create(OwnerAddress),
            ContractAddress is null ? null : BlockchainAddress.Create(ContractAddress),
            Title,
            Description,
            Configuration,
            (AuctionStatus)Status,
            (AuctionType)Type
        );
}