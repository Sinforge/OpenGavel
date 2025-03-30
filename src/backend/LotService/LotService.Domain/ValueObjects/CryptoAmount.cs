using DomainCore;

namespace LotService.Domain.ValueObjects;

public class CryptoAmount : ValueObject
{
    public decimal Value { get; private set; }
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    private CryptoAmount(decimal value)
    {
        Value = value;
    }

    public static CryptoAmount Create(decimal amount)
    {
        if(amount < 0)
            throw new ArgumentException("Amount cannot be lower than 0.", nameof(amount));
        
        return new(amount);
    }
}