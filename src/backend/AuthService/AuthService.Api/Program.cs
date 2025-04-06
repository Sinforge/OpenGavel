using AuthService.Api;
using AuthService.Application;
using AuthService.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyHeader()
            .WithOrigins("http://localhost:3000")
            .AllowCredentials();
    });
});
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
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();

