using LotService.Api.Contracts.Auction.AddBlindAuction;
using LotService.Api.Contracts.Auction.AddEnglishAuction;
using LotService.Application.Handlers.Commands.Auction.AddBlindAuction;
using LotService.Application.Handlers.Commands.Auction.AddEnglishAuction;
using Mapster;

namespace LotService.Api.Mappers.Auction;

public class AuctionMappingRegister : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<AddBlindAuctionRequest, AddBlindAuctionCommand>();
        config.NewConfig<AddEnglishAuctionRequest, AddEnglishAuctionCommand>();
    }
}