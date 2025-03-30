using LotService.Api.Contracts.Auction;
using LotService.Api.Contracts.Auction.AddAuction;
using LotService.Api.Contracts.Auction.GetAuctionById;
using LotService.Api.Contracts.Auction.GetUserAuctions;
using LotService.Application.Handlers.Commands.Auction.AddAuction;
using LotService.Application.Handlers.Queries.GetAuctionInfo.Models;
using LotService.Application.Handlers.Queries.GetUserAuctions;
using Mapster;
using GetUserAuctionsAuctionDto = LotService.Application.Handlers.Queries.GetUserAuctions.GetUserAuctionsAuctionDto;
using GetUserAuctionsResponse = LotService.Application.Handlers.Queries.GetUserAuctions.GetUserAuctionsResponse;

namespace LotService.Api.Mappers.Auction;

public class AuctionMappingRegister : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<AddAuctionRequest, AddAuctionCommand>();
        
        config.NewConfig<GetUserAuctionsResponse, Contracts.Auction.GetUserAuctions.GetUserAuctionsResponse>();
        config.NewConfig<GetUserAuctionsAuctionDto, Contracts.Auction.GetUserAuctions.GetUserAuctionsAuctionDto>();
        config.NewConfig<GetUserAuctionsRequest, GetUserAuctionsQuery>();
        
        config.NewConfig<AuctionInfo, GetAuctionResponse>();
    }
}