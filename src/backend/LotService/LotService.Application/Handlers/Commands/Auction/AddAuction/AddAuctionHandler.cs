using LotService.Application.Dto;
using LotService.Application.Repositories;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;
using MediatR;

namespace LotService.Application.Handlers.Commands.Auction.AddAuction;

internal class AddAuctionHandler(
    IAuctionRepository auctionRepository
) : IRequestHandler<AddAuctionCommand, IdDto<Guid>>
{
    public async Task<IdDto<Guid>> Handle(AddAuctionCommand request, CancellationToken cancellationToken)
    {
        var auction = AuctionEntity.Create(
            BlockchainAddress.Create(request.OwnerAddress),
            null,
            request.Title,
            request.Description,
            request.Configuration,
            AuctionStatus.Configured,
            request.Type,
            DateTimeRange.Create(request.StartTime, request.EndTime)
        );

        await auctionRepository.AddAsync(auction, cancellationToken);

        return new(auction.Id);
    }
}