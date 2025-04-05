using System.Data;
using DapperCore.ConnectionFactory;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace DapperCore;

public static class RegisterDependencies
{
    public static IServiceCollection AddDapperCore(this IServiceCollection services, string connectionString)
    {
        return services
            .AddSingleton<PostgresConnectionFactory>(_ => new PostgresConnectionFactory(connectionString));
    }
}