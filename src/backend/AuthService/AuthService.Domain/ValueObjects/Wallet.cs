using DomainCore;

namespace AuthService.Domain.ValueObjects;

public class Wallet : ValueObject
{
    public WalletAddress Address { get; private set; }
    public WalletProvider Provider { get; private set; }

    private Wallet(WalletAddress address, WalletProvider provider)
    {
        Address = address;
        Provider = provider;
    }
    
    public static Wallet Create(WalletAddress address, WalletProvider provider)
        => new(address, provider);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Address;
        yield return Provider;
    }
}