using DapperCore;
using LotService.Application.Repositories;
using LotService.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace LotService.Infrastructure;

public static class RegisterDependencies
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
        return services.AddDapperCore(connectionString)
            .AddScoped<IAuctionRepository, AuctionRepository>();
    }
}