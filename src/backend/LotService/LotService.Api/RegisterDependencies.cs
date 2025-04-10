using System.Text.Json;
using System.Text.Json.Serialization;
using LotService.Application;
using Mapster;
using MapsterMapper;

namespace LotService.Api;

public static class RegisterDependencies
{
    public static IServiceCollection AddApi(this IServiceCollection services)
    {
        return services
            .AddCommon()
            .AddMappers();
    }
    
    private static IServiceCollection AddMappers(this IServiceCollection services)
    {
        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(typeof(IAssemblyMarker).Assembly);

        var mapperConfig = new Mapper(config);
        return services.AddSingleton<IMapper>(mapperConfig);
    }

    private static IServiceCollection AddCommon(this IServiceCollection services)
    {
        services.AddControllers()
            .AddJsonOptions(options => 
            {
                options.JsonSerializerOptions.Converters.Add(
                    new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseUpper)
                );
            });        
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        return services;
    }
}