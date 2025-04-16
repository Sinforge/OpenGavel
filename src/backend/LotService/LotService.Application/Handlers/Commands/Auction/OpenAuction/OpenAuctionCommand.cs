using LotService.Domain.Enums;
using MediatR;

namespace LotService.Application.Handlers.Commands.Auction.OpenAuction;

public sealed record OpenAuctionCommand(
    Guid Id,
    ChainId ChainId, 
    string ContractAddress) : IRequest;