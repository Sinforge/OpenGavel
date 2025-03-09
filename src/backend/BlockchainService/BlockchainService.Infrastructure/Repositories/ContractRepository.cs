using System.Collections.Concurrent;
using BlockchainService.Application.Repositories;
using BlockchainService.Domain.Entities;
using MongoDB.Driver;

namespace BlockchainService.Infrastructure.Repositories;

public class ContractRepository : IContractRepository
{
    private readonly IMongoCollection<Contract> _collection;
    private readonly ConcurrentDictionary<string, Contract> _inMemoryCache = new();
    
    public ContractRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<Contract>("Contracts");
    }
    public async Task AddContractAsync(Contract contract, CancellationToken cancellationToken)
    {
        await _collection.InsertOneAsync(contract, cancellationToken: cancellationToken);

        _inMemoryCache[contract.Name] = contract;
    }

    public async Task<Contract?> GetContractByNameAsync(string name, CancellationToken cancellationToken)
    {
        if (_inMemoryCache.TryGetValue(name, out var contract))
        {
            return contract;
        }

        contract = await _collection.Find(c => c.Name == name).FirstOrDefaultAsync(cancellationToken: cancellationToken);

        if (contract != null)
        {
            _inMemoryCache[name] = contract;
        }

        return contract;
        
    }
    
    public async Task LoadContractsIntoMemoryAsync(CancellationToken cancellationToken)
    {
        var contracts = await _collection.Find(_ => true).ToListAsync(cancellationToken);
        foreach (var contract in contracts)
        {
            _inMemoryCache[contract.Name] = contract;
        }
    }
}