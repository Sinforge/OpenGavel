using LotService.Application.Dto;
using LotService.Application.Repositories;
using LotService.Domain.Entities;
using LotService.Domain.ValueObjects;
using MediatR;

namespace LotService.Application.Handlers.Commands.Auction.AddBlindAuction;

internal class AddBlindAuctionHandler(
    IBlindAuctionRepository blindAuctionRepository
) : IRequestHandler<AddBlindAuctionCommand, IdDto<Guid>>
{
    public async Task<IdDto<Guid>> Handle(AddBlindAuctionCommand request, CancellationToken cancellationToken)
    {
        var auction = BlindAuction.Create(
            BlockchainAddress.Create(request.OwnerAddress),
            BlockchainAddress.Create(request.OwnerAddress),
            request.Title,
            request.Description,
            request.StartTime,
            request.EndTime,
            BidAmount.Create(request.BidAmount)
        );

        await blindAuctionRepository.AddAsync(auction, cancellationToken);

        return new(auction.Id);
    }
}