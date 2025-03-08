using AuthService.Domain.ValueObjects;
using DomainCore;

namespace AuthService.Domain.Entities;

public class Admin: Entity<Guid>
{
    public Email Email { get; private set; }
    public string PasswordHash {get; private set;}
    
    private Admin(){}
    private Admin(Guid id, Email email, string passwordHash) : base(id)
    {
        Email = email;
        PasswordHash = passwordHash;
    }
}