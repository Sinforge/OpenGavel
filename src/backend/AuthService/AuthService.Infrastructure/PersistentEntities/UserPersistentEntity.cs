using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Infrastructure.PersistentEntities;

[Table("user")]
public class UserPersistentEntity
{
    [Column("id")]
    [Required]
    public Guid Id;

    [Column("wallet_address")]
    [Required]
    public string WalletAddress;

    [Column("wallet_provider")]
    [Required]
    public int WalletProvider;

    public UserPersistentEntity(Guid id, string walletAddress, int walletProvider)
    {
        Id = id;
        WalletAddress = walletAddress;
        WalletProvider = walletProvider;
    }
    
}