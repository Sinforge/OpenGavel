namespace BlockchainService;

public static class RegisterDependencies
{
    public static IServiceCollection AddApi(this IServiceCollection services)
    {
        return services
            .AddGrpcServices()
            .AddRestServices();
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
}