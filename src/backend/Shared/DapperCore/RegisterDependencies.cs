using System.Data;
using System.Reflection;
using DapperCore.Repository;
using DapperCore.UoW;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace DapperCore;

public static class RegisterDependencies
{
    public static IServiceCollection AddDapperCore(this IServiceCollection services, string connectionString)
    {
        return services
            .AddScoped<IDbConnection>(_ => new NpgsqlConnection(connectionString))
            .AddScoped<IUnitOfWork, UnitOfWork>()
            .AddRepositories(Assembly.GetExecutingAssembly());
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services, Assembly assembly)
    {
        var repositoryTypes = assembly.GetTypes()
            .Where(t => t is { IsClass: true, IsAbstract: false } && t.GetInterfaces().Contains(typeof(IRepository<,,>)));

        foreach (var repoType in repositoryTypes)
        {
            var interfaceType = repoType.GetInterfaces().FirstOrDefault(i => i.Name.EndsWith("Repository"));
            if(interfaceType != null)
                services.AddScoped(interfaceType, repoType);
        }
        return services;
    }
}