using AuthService.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace AuthService.Application;

public static class RegisterDependencies
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        return services
            .AddCommon()
            .AddMediator();
    }

    private static IServiceCollection AddCommon(this IServiceCollection services)
    {
        return services
            .AddScoped<IJwtTokenService, JwtTokenService>()
            .AddScoped<IAddressVerifier, AddressVerifier>();
    }

    private static IServiceCollection AddMediator(this IServiceCollection services)
    {
        return services
            .AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(IAssemblyMarker).Assembly));
    }
}