using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Infrastructure.PersistentEntities;

[Table("admin")]
public class AdminPersistentEntity
{
    [Column("id")]
    [Required]
    public Guid Id;

    [Column("email")]
    [Required]
    public string Email;
    
    [Column("password_hash")]
    [Required]
    public string PasswordHash;

    public AdminPersistentEntity(Guid id, string email, string passwordHash)
    {
        Id = id;
        Email = email;
        PasswordHash = passwordHash;
    }
}