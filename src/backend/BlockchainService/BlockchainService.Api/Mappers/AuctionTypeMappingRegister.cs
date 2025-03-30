using BlockchainService.Application.Handlers.Queries.Contracts.GetContract;
using BlockchainService.Contracts;
using Mapster;

namespace BlockchainService.Mappers;

public class AuctionTypeMappingRegister : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<GetContractDto, GetContractMetadataResponse>();
        /*config.NewConfig<AuctionType, Application.Enums.AuctionType>();
        config.NewConfig<PublishAuctionContractRequest, PublishContractCommand>();*/
    }
}