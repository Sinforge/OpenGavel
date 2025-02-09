using AuthService.Domain.Common;
using DomainCore;

namespace AuthService.Domain.Aggregates.AdminAggregate;

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