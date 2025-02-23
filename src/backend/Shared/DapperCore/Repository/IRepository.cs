using DomainCore;

namespace DapperCore.Repository;

public interface IRepository<in TDomainEntity, TPersistentEntity, TId>
    where TDomainEntity : Entity<TId>
    where TPersistentEntity : class
    where TId : notnull
{
    Task AddAsync(TDomainEntity domainEntity, CancellationToken cancellationToken);
    Task DeleteByIdAsync(TId id, CancellationToken cancellationToken);
}