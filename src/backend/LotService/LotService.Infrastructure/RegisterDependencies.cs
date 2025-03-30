using Dapper.FluentMap;
using DapperCore;
using LotService.Application.Repositories;
using LotService.Infrastructure.Mapping;
using LotService.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace LotService.Infrastructure;

public static class RegisterDependencies
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        FluentMapper.Initialize(config =>
        {
            config.AddMap(new AuctionMap());
        });
        return services.AddDapperCore(connectionString)
            .AddScoped<IAuctionRepository, AuctionRepository>();
    }
}