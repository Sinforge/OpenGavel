using BlockchainService.Application.Repositories;
using BlockchainService.Application.Services;
using BlockchainService.Infrastructure.Repositories;
using BlockchainService.Infrastructure.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace BlockchainService.Infrastructure;

public static class RegisterDependencies
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, 
        string mongoConnectionString,
        string postgresConnectionString)
    {
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        
        var mongoClient = new MongoClient(mongoConnectionString);
        var mongoDatabase = mongoClient.GetDatabase("ContractsDB");
        return services.AddSingleton(mongoDatabase)
            .AddSingleton<IContractRepository, ContractRepository>();
    }

    public static async Task LoadContractToMemory(this IApplicationBuilder app, CancellationToken cancellationToken = default)
    {
        var repository = app.ApplicationServices.GetRequiredService<IContractRepository>();
        if (repository is { } contractRepository)
        {
            await contractRepository.LoadContractsIntoMemoryAsync(cancellationToken);
        }

    }
}