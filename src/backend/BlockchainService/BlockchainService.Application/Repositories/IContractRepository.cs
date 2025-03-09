using BlockchainService.Domain.Entities;

namespace BlockchainService.Application.Repositories;

public interface IContractRepository
{
    Task AddContractAsync(Contract contract, CancellationToken cancellationToken);
    Task<Contract?> GetContractByNameAsync(string name, CancellationToken cancellationToken);
    Task LoadContractsIntoMemoryAsync(CancellationToken cancellationToken);
}