using DomainCore;

namespace LotService.Domain.ValueObjects;

public class EthAmount : ValueObject
{
    public decimal Value { get; private set; }
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    private EthAmount(decimal value)
    {
        Value = value;
    }

    public static EthAmount Create(decimal amount)
    {
        if(amount < 0)
            throw new ArgumentException("Amount cannot be lower than 0.", nameof(amount));
        
        return new(amount);
    }
}