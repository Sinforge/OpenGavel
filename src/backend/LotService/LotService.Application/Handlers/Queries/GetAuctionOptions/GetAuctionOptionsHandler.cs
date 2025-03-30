using System.Text.Json;
using LotService.Application.Repositories;
using MediatR;

namespace LotService.Application.Handlers.Queries.GetAuctionOptions;

internal class GetAuctionOptionsHandler(
    IAuctionRepository blindAuctionRepository
    ) : IRequestHandler<GetAuctionOptionsQuery, object>
{
    public async Task<object> Handle(GetAuctionOptionsQuery request, CancellationToken cancellationToken)
    {
        var auction = await blindAuctionRepository.GetByIdAsync(request.AuctionId, cancellationToken);
        if(auction == null)
            throw new ArgumentNullException(nameof(auction));

        return auction.Configuration;
    }
}