using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Infrastructure.PersistentEntities;

[Table("admin")]
public class AdminPersistentEntity
{
    [Column("id")]
    [Key]
    [Required]
    public Guid Id { get; }

    [Column("email")]
    [Required]
    public string Email { get; }
    
    [Column("password_hash")]
    [Required]
    public string PasswordHash { get; }

    public AdminPersistentEntity(Guid id, string email, string passwordHash)
    {
        Id = id;
        Email = email;
        PasswordHash = passwordHash;
    }
}