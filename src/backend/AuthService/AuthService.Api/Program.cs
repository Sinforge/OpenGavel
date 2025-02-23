using AuthService.Api;
using AuthService.Application;
using AuthService.Infrastructure;
using DapperCore;

var builder = WebApplication.CreateBuilder(args);

var dbConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

builder.Services
    .AddApi()
    .AddApplication()
    .AddInfrastructure(dbConnectionString);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();

