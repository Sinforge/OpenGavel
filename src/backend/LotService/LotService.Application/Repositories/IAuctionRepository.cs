using LotService.Application.Dto;
using LotService.Application.Repositories.Models;
using LotService.Domain.Entities;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;

namespace LotService.Application.Repositories;

public interface IAuctionRepository
{
    Task AddAsync(Auction auction, CancellationToken cancellationToken);
    Task<Auction?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task OpenAsync(Guid id, DeployedContract deployedContract, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Auction>> GetByUserAsync(BlockchainAddress userAddress, CancellationToken cancellationToken);
    Task<PagedResult<Auction>> GetPagedAuctionsAsync(GetPagedAuctionsQuery query, CancellationToken cancellationToken);
}