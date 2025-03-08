using Dapper;
using DapperCore.Repository;
using DapperCore.UoW;
using LotService.Application.Repositories;
using LotService.Domain.Entities;
using LotService.Domain.ValueObjects;
using LotService.Infrastructure.PersistentEntities;

namespace LotService.Infrastructure.Repositories;

public class BlindAuctionRepository(IUnitOfWork unitOfWork)
    : Repository<BlindAuction, BlindAuctionPersistentEntity, Guid>(unitOfWork), IBlindAuctionRepository
{
    protected override BlindAuctionPersistentEntity MapToPersistent(BlindAuction domain)
        => new(
            domain.Id,
            domain.ContractAddress.Value,
            domain.OwnerAddress.Value,
            domain.Title,
            domain.Description,
            domain.StartTime,
            domain.EndTime,
            domain.BidAmount.Value);

    protected override BlindAuction MapToDomain(BlindAuctionPersistentEntity persistent)
        => BlindAuction.Create(
            persistent.Id,
            BlockchainAddress.Create(persistent.ContractAddress),
            BlockchainAddress.Create(persistent.OwnerAddress),
            persistent.Title,
            persistent.Description,
            persistent.StartTime,
            persistent.EndTime,
            BidAmount.Create(persistent.BidsAmount)
        );
}