using DapperCore;
using DapperCore.MediatR;
using LotService.Application.Repositories;
using LotService.Infrastructure.Repositories;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace LotService.Infrastructure;

public static class RegisterDependencies
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        return services.AddDapperCore(connectionString)
            .AddScoped<IBlindAuctionRepository, BlindAuctionRepository>()
            .AddScoped<IEnglishAuctionRepository, EnglishAuctionRepository>()
            .AddTransient(typeof(IPipelineBehavior<,>), typeof(TransactionalPipelineBehavior<,>));

    }
}