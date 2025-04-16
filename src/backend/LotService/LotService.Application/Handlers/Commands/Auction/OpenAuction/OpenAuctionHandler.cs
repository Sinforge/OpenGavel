using LotService.Application.Exceptions.Auction;
using LotService.Application.Repositories;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;
using MediatR;

namespace LotService.Application.Handlers.Commands.Auction.OpenAuction;

internal class OpenAuctionHandler(
    IAuctionRepository auctionRepository
    ) : IRequestHandler<OpenAuctionCommand>
{
    public async Task Handle(OpenAuctionCommand request, CancellationToken cancellationToken)
    {
        var auction = await auctionRepository.GetByIdAsync(request.Id, cancellationToken);
        if (auction is null)
            throw new AuctionNotFoundException();

        if (auction.Status is not AuctionStatus.Configured)
            throw new AuctionCannotBeDeployedException();

        var deployedContract = DeployedContract.Create(
            request.ChainId,
            BlockchainAddress.Create(request.ContractAddress)
        );
        
        await auctionRepository.OpenAsync(request.Id, deployedContract, cancellationToken);
    }
}