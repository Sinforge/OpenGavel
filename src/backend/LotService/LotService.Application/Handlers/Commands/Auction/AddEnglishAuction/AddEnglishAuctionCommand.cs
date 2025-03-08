using DapperCore.MediatR;
using LotService.Application.Dto;
using MediatR;

namespace LotService.Application.Handlers.Commands.Auction.AddEnglishAuction;

public sealed record AddEnglishAuctionCommand(
    string OwnerAddress,
    string Title,
    string Description,
    DateTime StartTime,
    DateTime EndTime,
    decimal StartPrice,
    decimal BidStep) : IRequest<IdDto<Guid>>, ITransactional;