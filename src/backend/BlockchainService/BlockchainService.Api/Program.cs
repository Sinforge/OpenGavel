using BlockchainService;
using BlockchainService.Application;
using BlockchainService.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDb")!;
builder.Services
    .AddApi()
    .AddApplication()
    .AddInfrastructure(mongoConnectionString);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapGrpcService<BlockchainService.Grpc.BlockchainService>();
app.MapControllers();
await app.LoadContractToMemory(CancellationToken.None);
await app.RunAsync();
