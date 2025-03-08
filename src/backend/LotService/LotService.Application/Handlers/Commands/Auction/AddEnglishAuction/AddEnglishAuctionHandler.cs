using LotService.Application.Dto;
using LotService.Application.Repositories;
using LotService.Domain.Entities;
using LotService.Domain.ValueObjects;
using MediatR;

namespace LotService.Application.Handlers.Commands.Auction.AddEnglishAuction;

internal class AddEnglishAuctionHandler(
    IEnglishAuctionRepository englishAuctionRepository
) : IRequestHandler<AddEnglishAuctionCommand, IdDto<Guid>>
{
    public async Task<IdDto<Guid>> Handle(AddEnglishAuctionCommand request, CancellationToken cancellationToken)
    {
        var auction = EnglishAuction.Create(
            // TODO: change to contract address
            BlockchainAddress.Create(request.OwnerAddress),
            BlockchainAddress.Create(request.OwnerAddress),
            request.Title,
            request.Description,
            request.StartTime,
            request.EndTime,
            EthAmount.Create(request.StartPrice),
            EthAmount.Create(request.BidStep)
        );

        await englishAuctionRepository.AddAsync(auction, cancellationToken);

        return new(auction.Id);
    }
}