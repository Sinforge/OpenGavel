using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LotService.Infrastructure.PersistentEntities;

public abstract class BaseAuctionPersistentEntity
{
    [Column("id")]
    [Key]
    [Required]
    public Guid Id { get; }
    
    [Column("contract_address")]
    [Required]
    public string ContractAddress { get; }
    
    [Column("owner_address")]
    [Required]
    public string OwnerAddress { get; }
    
    [Column("title")]
    [Required]
    public string Title { get; }
    
    [Column("description")]
    [Required]
    public string Description { get; }
    
    [Column("start_time")]
    [Required]
    public DateTime StartTime { get; }
    
    [Column("end_time")]
    [Required]
    public DateTime EndTime { get; }

    protected BaseAuctionPersistentEntity(Guid id, string contractAddress, string ownerAddress, string title, string description, DateTime startTime, DateTime endTime)
    {
        Id = id;
        ContractAddress = contractAddress;
        OwnerAddress = ownerAddress;
        Title = title;
        Description = description;
        StartTime = startTime;
        EndTime = endTime;
    }
}