using DomainCore;

namespace AuthService.Domain.Aggregates.UserAggregate;

public class User : AggregateRoot<Guid>
{
    public Wallet Wallet { get; private set; }

    private User(Guid id, Wallet wallet) : base(id)
    {
        Wallet = wallet;
    }
    
    public static User Create(Wallet wallet)
        => new(Guid.NewGuid(), wallet);
    
    public static User Create(Guid id, Wallet wallet)
        => new(id, wallet);
}