using LotService.Application.Dto;
using LotService.Domain.Enums;
using MediatR;

namespace LotService.Application.Handlers.Commands.Auction.AddAuction;

// TODO: add validators for configuration
public sealed record AddAuctionCommand(
    string OwnerAddress,
    string Title,
    string Description,
    object Configuration,
    AuctionType Type) : IRequest<IdDto<Guid>>;