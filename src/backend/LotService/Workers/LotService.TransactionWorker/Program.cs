using LotService.TransactionWorker;
using LotService.TransactionWorker.Repositories;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();
builder.Services.AddSingleton<IAuctionRepository, AuctionRepository>();
var host = builder.Build();
host.Run();