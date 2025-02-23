using AuthService.Application.Repositories;
using AuthService.Infrastructure.Repositories;
using DapperCore;
using DapperCore.MediatR;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace AuthService.Infrastructure;

public static class RegisterDependencies
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        return services.AddDapperCore(connectionString)
            .AddScoped<IUserRepository, UserRepository>()
            .AddTransient(typeof(IPipelineBehavior<,>), typeof(TransactionalPipelineBehavior<,>));
    }
}