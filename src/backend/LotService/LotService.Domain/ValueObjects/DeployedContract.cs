using DomainCore;
using LotService.Domain.Enums;

namespace LotService.Domain.ValueObjects;

public class DeployedContract : ValueObject
{
    public ChainId ChainId { get; private set; }
    public BlockchainAddress Address { get; private set; }
    
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return ChainId;
        yield return Address;
    }

    private DeployedContract(ChainId chainId, BlockchainAddress address)
    {
        ChainId = chainId;
        Address = address;
    }

    public static DeployedContract Create(ChainId chainId, BlockchainAddress address)
        => new(chainId, address);
}