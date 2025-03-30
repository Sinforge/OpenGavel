using BlockchainService;
using BlockchainService.Application;
using BlockchainService.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDb")!;
var postgresConnectionString = builder.Configuration.GetConnectionString("Postgres")!;
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyHeader()
            .WithOrigins("http://localhost:3000")
            .AllowCredentials();
    });
});
builder.Services
    .AddApi()
    .AddApplication()
    .AddInfrastructure(mongoConnectionString, postgresConnectionString);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.MapControllers();
await app.LoadContractToMemory(CancellationToken.None);
await app.RunAsync();
