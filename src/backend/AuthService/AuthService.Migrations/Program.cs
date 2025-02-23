using AuthService.Migrations;
using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = Host.CreateDefaultBuilder()
    .ConfigureServices((_, services) =>
    {
        services
            .AddFluentMigratorCore()
            .ConfigureRunner(rb => rb
                .AddPostgres()
                .WithGlobalConnectionString("Host=localhost;Port=5432;Database=test;Username=user;Password=postgres;")
                .ScanIn(typeof(IAssemblyMarker).Assembly).For.Migrations())
            .AddLogging(lb => lb.AddFluentMigratorConsole());
    })
    .Build();

using var scope = host.Services.CreateScope();
var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();

runner.MigrateUp();

Console.WriteLine("Migrations successfully applied!");