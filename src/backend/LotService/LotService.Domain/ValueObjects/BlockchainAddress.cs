using DomainCore;

namespace LotService.Domain.ValueObjects;

public class BlockchainAddress: ValueObject
{
    public string Value { get; private set; }
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    private BlockchainAddress(string address)
    {
        Value = address;
    }

    public static BlockchainAddress Create(string address)
    {
        if(string.IsNullOrWhiteSpace(address))
            throw new ArgumentException("Wallet address cannot be empty.", nameof(address));
        
        if(!address.StartsWith("0x") || address.Length != 42)
            throw new ArgumentException("Invalid wallet address format.", nameof(address));
        
        return new(address);
    }

}