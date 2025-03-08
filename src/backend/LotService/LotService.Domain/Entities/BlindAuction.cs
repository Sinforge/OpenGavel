using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;

namespace LotService.Domain.Entities;

public sealed class BlindAuction : BaseAuction
{
    public BidAmount BidAmount { get; }

    private BlindAuction(BlockchainAddress contractAddress, BlockchainAddress ownerAddress,
        string title, string description, DateTime startTime, DateTime endTime, BidAmount bidAmount) 
        : base(contractAddress, ownerAddress, AuctionType.Blind, title, description, startTime, endTime)
    {
        BidAmount = bidAmount;
    }
    
    private BlindAuction(Guid id, BlockchainAddress contractAddress, BlockchainAddress ownerAddress,
        string title, string description, DateTime startTime, DateTime endTime, BidAmount bidAmount) 
        : base(id, contractAddress, ownerAddress, AuctionType.Blind, title, description, startTime, endTime)
    {
        BidAmount = bidAmount;
    }

    public static BlindAuction Create(BlockchainAddress contractAddress, BlockchainAddress ownerAddress,
        string title, string description, DateTime startTime, DateTime endTime, BidAmount bidAmount)
        => new(contractAddress, ownerAddress, title, description, startTime, endTime, bidAmount);
    
    public static BlindAuction Create(Guid id, BlockchainAddress contractAddress, BlockchainAddress ownerAddress,
        string title, string description, DateTime startTime, DateTime endTime, BidAmount bidAmount)
        => new(id, contractAddress, ownerAddress, title, description, startTime, endTime, bidAmount);
}