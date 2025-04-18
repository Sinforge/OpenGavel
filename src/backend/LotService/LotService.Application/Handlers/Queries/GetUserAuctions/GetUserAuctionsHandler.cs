using System.Text.Json;
using LotService.Application.Repositories;
using LotService.Domain.ValueObjects;
using MediatR;

namespace LotService.Application.Handlers.Queries.GetUserAuctions;

internal class GetUserAuctionsHandler(
    IAuctionRepository auctionRepository) 
    : IRequestHandler<GetUserAuctionsQuery, GetUserAuctionsResponse>
{
    public async Task<GetUserAuctionsResponse> Handle(GetUserAuctionsQuery request, CancellationToken cancellationToken)
    {
        var address = BlockchainAddress.Create(request.Address);
        var auctions = await auctionRepository.GetByUserAsync(address, cancellationToken);

        var response = auctions
            .Select(x => new GetUserAuctionsAuctionDto(
                x.Id,
                x.DeployedContract?.Address.Value,
                (int?)x.DeployedContract?.ChainId,
                x.Title,
                x.Status,
                x.Type,
                JsonSerializer.Deserialize<object>((string)x.Configuration)
            ))
            .ToList();
        
        return new(response);
    }
}