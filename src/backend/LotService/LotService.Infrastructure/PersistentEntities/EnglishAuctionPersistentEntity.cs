using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LotService.Infrastructure.PersistentEntities;

[Table("english_auction")]
public sealed class EnglishAuctionPersistentEntity : BaseAuctionPersistentEntity
{
    [Column("start_price")]
    [Required]
    public decimal StartPrice { get; }
    
    [Column("bid_step")]
    [Required]
    public decimal BidStep { get; }
    
    public EnglishAuctionPersistentEntity(Guid id, string contractAddress, string ownerAddress,
        string title, string description, DateTime startTime, DateTime endTime, decimal startPrice, decimal bidStep) 
        : base(id, contractAddress, ownerAddress, title, description, startTime, endTime)
    {
        StartPrice = startPrice;
        BidStep = bidStep;
    }
} 