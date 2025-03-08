using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;

namespace LotService.Domain.Entities;

public sealed class EnglishAuction : BaseAuction
{
    public EthAmount StartPrice { get; }

    public EthAmount BidStep { get; }
    
    private EnglishAuction(BlockchainAddress contractAddress, BlockchainAddress ownerAddress, string title, 
        string description, DateTime startTime, DateTime endTime, EthAmount startPrice, EthAmount bidStep) 
        : base(contractAddress, ownerAddress, AuctionType.English, title, description, startTime, endTime)
    {
        StartPrice = startPrice;
        BidStep = bidStep;
    }
    
    private EnglishAuction(Guid id, BlockchainAddress contractAddress, BlockchainAddress ownerAddress, string title, 
        string description, DateTime startTime, DateTime endTime, EthAmount startPrice, EthAmount bidStep) 
        : base(id, contractAddress, ownerAddress, AuctionType.English, title, description, startTime, endTime)
    {
        StartPrice = startPrice;
        BidStep = bidStep;
    }


    public static EnglishAuction Create(BlockchainAddress contractAddress, BlockchainAddress ownerAddress, string title,
        string description, DateTime startTime, DateTime endTime, EthAmount startPrice,
        EthAmount bidStep)
        => new(contractAddress, ownerAddress, title, description, startTime, endTime, startPrice, bidStep);
    
    public static EnglishAuction Create(Guid id, BlockchainAddress contractAddress, BlockchainAddress ownerAddress, string title,
        string description, DateTime startTime, DateTime endTime, EthAmount startPrice,
        EthAmount bidStep)
        => new(id, contractAddress, ownerAddress, title, description, startTime, endTime, startPrice, bidStep);
}