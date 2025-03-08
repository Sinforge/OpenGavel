using DapperCore.Repository;
using DapperCore.UoW;
using LotService.Application.Repositories;
using LotService.Domain.Entities;
using LotService.Domain.ValueObjects;
using LotService.Infrastructure.PersistentEntities;

namespace LotService.Infrastructure.Repositories;

public class EnglishAuctionRepository(IUnitOfWork unitOfWork)
    : Repository<EnglishAuction, EnglishAuctionPersistentEntity, Guid>(unitOfWork), IEnglishAuctionRepository
{
    protected override EnglishAuctionPersistentEntity MapToPersistent(EnglishAuction domain)
        => new(
            domain.Id,
            domain.ContractAddress.Value,
            domain.OwnerAddress.Value,
            domain.Title,
            domain.Description,
            domain.StartTime,
            domain.EndTime,
            domain.StartPrice.Value,
            domain.BidStep.Value);

    protected override EnglishAuction MapToDomain(EnglishAuctionPersistentEntity persistent)
        => EnglishAuction.Create(
            persistent.Id,
            BlockchainAddress.Create(persistent.ContractAddress),
            BlockchainAddress.Create(persistent.OwnerAddress),
            persistent.Title,
            persistent.Description,
            persistent.StartTime,
            persistent.EndTime,
            EthAmount.Create(persistent.StartPrice),
            EthAmount.Create(persistent.BidStep)
        );
}