using MediatR;

namespace LotService.Application.Handlers.Queries.GetAuctionOptions;

public sealed record GetAuctionOptionsQuery(Guid AuctionId) : IRequest<object>;