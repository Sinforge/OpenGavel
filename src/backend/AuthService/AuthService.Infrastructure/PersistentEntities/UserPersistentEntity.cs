using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Infrastructure.PersistentEntities;

[Table("user")]
public class UserPersistentEntity
{
    [Column("id")]
    [Key]
    [Required]
    public Guid Id { get; }

    [Column("wallet_address")]
    [Required]
    public string WalletAddress { get; }

    [Column("wallet_provider")]
    [Required]
    public int WalletProvider { get; }

    public UserPersistentEntity(Guid id, string walletAddress, int walletProvider)
    {
        Id = id;
        WalletAddress = walletAddress;
        WalletProvider = walletProvider;
    }
    
}