using LotService.Domain.Entities;

namespace LotService.Application.Repositories;

public interface IBlindAuctionRepository
{
    Task AddAsync(BlindAuction auction, CancellationToken cancellationToken);
}