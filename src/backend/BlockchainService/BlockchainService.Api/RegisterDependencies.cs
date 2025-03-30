using Mapster;
using MapsterMapper;

namespace BlockchainService;

public static class RegisterDependencies
{
    public static IServiceCollection AddApi(this IServiceCollection services)
    {
        return services
            .AddGrpcServices()
            .AddRestServices()
            .AddMappers();
    }

    private static IServiceCollection AddGrpcServices(this IServiceCollection services)
        => services
            .AddGrpcReflection()
            .AddGrpc()
            .Services;
    
    private static IServiceCollection AddRestServices(this IServiceCollection services)
    => services.AddEndpointsApiExplorer()
        .AddSwaggerGen()
        .AddControllers().Services;
    
    private static IServiceCollection AddMappers(this IServiceCollection services)
    {
        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(typeof(IAssemblyMarker).Assembly);

        var mapperConfig = new Mapper(config);
        return services.AddSingleton<IMapper>(mapperConfig);
    }
}