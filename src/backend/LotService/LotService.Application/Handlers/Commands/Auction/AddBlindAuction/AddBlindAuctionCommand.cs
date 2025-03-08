using DapperCore.MediatR;
using LotService.Application.Dto;
using MediatR;

namespace LotService.Application.Handlers.Commands.Auction.AddBlindAuction;

public sealed record AddBlindAuctionCommand(
    string OwnerAddress,
    string Title,
    string Description,
    DateTime StartTime,
    DateTime EndTime,
    int BidAmount) : IRequest<IdDto<Guid>>, ITransactional;