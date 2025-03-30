using MediatR;

namespace LotService.Application.Handlers.Queries.GetUserAuctions;

public sealed record GetUserAuctionsQuery(string Address)
    : IRequest<GetUserAuctionsResponse>;