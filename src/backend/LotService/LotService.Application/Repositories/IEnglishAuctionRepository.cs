using LotService.Domain.Entities;

namespace LotService.Application.Repositories;

public interface IEnglishAuctionRepository
{
    Task AddAsync(EnglishAuction auction, CancellationToken cancellationToken);
}