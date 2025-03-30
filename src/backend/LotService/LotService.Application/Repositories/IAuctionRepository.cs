using LotService.Domain.Entities;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;

namespace LotService.Application.Repositories;

public interface IAuctionRepository
{
    Task AddAsync(Auction auction, CancellationToken cancellationToken);
    Task<Auction?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task UpdateStatusAsync(Guid id, AuctionStatus status, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Auction>> GetByUserAsync(BlockchainAddress userAddress, CancellationToken cancellationToken);
}