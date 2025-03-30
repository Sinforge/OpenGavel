using LotService.Application.Handlers.Queries.GetAuctionInfo.Models;
using MediatR;

namespace LotService.Application.Handlers.Queries.GetAuctionInfo;

public record GetAuctionInfoQuery(Guid AuctionId) : IRequest<AuctionInfo>;