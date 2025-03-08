using DomainCore;

namespace LotService.Domain.ValueObjects;

public class BidAmount : ValueObject
{
    public int Value { get; private set; }
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    private BidAmount(int value)
    {
        Value = value;
    }

    public static BidAmount Create(int amount)
    {
        if(amount < 0)
            throw new ArgumentException("Bids amount cannot be lower or equal than 0.", nameof(amount));
        
        return new(amount);
    }
}