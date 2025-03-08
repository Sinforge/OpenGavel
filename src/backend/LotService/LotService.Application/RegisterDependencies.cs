using Microsoft.Extensions.DependencyInjection;

namespace LotService.Application;

public static class RegisterDependencies
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        return services
            .AddMediator();
    }
    

    private static IServiceCollection AddMediator(this IServiceCollection services)
    {
        return services
            .AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(IAssemblyMarker).Assembly));
    }
}