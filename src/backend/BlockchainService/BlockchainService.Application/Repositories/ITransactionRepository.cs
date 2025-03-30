using BlockchainService.Domain.Entities;

namespace BlockchainService.Application.Repositories;

public interface ITransactionRepository
{
    Task<> GetTransactionsBatchAsync(Transaction transaction, CancellationToken cancellationToken);
}