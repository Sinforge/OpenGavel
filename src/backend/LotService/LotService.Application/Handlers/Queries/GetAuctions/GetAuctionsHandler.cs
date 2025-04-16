using LotService.Application.Dto;
using LotService.Application.Repositories;
using LotService.Application.Repositories.Models;
using LotService.Domain.Enums;
using MediatR;

namespace LotService.Application.Handlers.Queries.GetAuctions;

internal class GetAuctionsHandler(
    IAuctionRepository auctionRepository
    ) : IRequestHandler<GetAuctionsQuery, PagedResult<GetAuctionsDto>>
{
    public async Task<PagedResult<GetAuctionsDto>> Handle(GetAuctionsQuery request, CancellationToken cancellationToken)
    {
        var pagedQuery = new GetPagedAuctionsQuery(
            request.Offset,
            request.Limit,
            request.Type,
            request.Name,
            request.StartDate,
            request.EndDate,
            request.IncludeClosed
        );
        var response = await auctionRepository.GetPagedAuctionsAsync(pagedQuery, cancellationToken);

        var mapped = response.Items
            .Select(x => new GetAuctionsDto(
                x.Id,
                x.DeployedContract!.Address.Value,
                x.DeployedContract!.ChainId,
                x.OwnerAddress.Value,
                x.Title,
                x.Description,
                x.Status is AuctionStatus.Closed,
                x.Type
                ))
            .ToList();
        
        return new PagedResult<GetAuctionsDto>(mapped,response.Items.Count);
    }
}