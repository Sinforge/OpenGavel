using LotService.Application.Dto;
using LotService.Domain.Enums;
using MediatR;

namespace LotService.Application.Handlers.Commands.Auction.AddAuction;

public sealed record AddAuctionCommand(
    string OwnerAddress,
    string Title,
    string Description,
    DateTime StartTime,
    DateTime EndTime,
    object Configuration,
    AuctionType Type) : IRequest<IdDto<Guid>>;