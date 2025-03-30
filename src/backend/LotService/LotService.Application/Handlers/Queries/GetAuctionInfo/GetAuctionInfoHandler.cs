using LotService.Application.Handlers.Queries.GetAuctionInfo.Models;
using LotService.Application.Repositories;
using MediatR;

namespace LotService.Application.Handlers.Queries.GetAuctionInfo;

internal class GetAuctionInfoHandler(
    IAuctionRepository blindAuctionRepository
    ) : IRequestHandler<GetAuctionInfoQuery, AuctionInfo>
{
    public async Task<AuctionInfo> Handle(GetAuctionInfoQuery request, CancellationToken cancellationToken)
    {
        var auction = await blindAuctionRepository.GetByIdAsync(request.AuctionId, cancellationToken);
        if(auction == null)
            throw new ArgumentNullException(nameof(auction));
        
        return new AuctionInfo(
            auction.OwnerAddress.Value,
            auction.ContractAddress?.Value,
            auction.Title,
            auction.Description,
            auction.Configuration,
            auction.Status,
            auction.Type
        );
    }
}