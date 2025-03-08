using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LotService.Infrastructure.PersistentEntities;

[Table("blind_auction")]
public sealed class BlindAuctionPersistentEntity : BaseAuctionPersistentEntity
{
    [Column("bids_amount")]
    [Required]
    public int BidsAmount { get; }
    public BlindAuctionPersistentEntity(Guid id, string contractAddress, string ownerAddress,
        string title, string description, DateTime startTime, DateTime endTime, int bidsAmount) 
        : base(id, contractAddress, ownerAddress, title, description, startTime, endTime)
    {
        BidsAmount = bidsAmount;
    }
}