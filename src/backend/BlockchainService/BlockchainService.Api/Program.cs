using BlockchainService;
using BlockchainService.Application;
using BlockchainService.Infrastructure;

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
builder.Services
    .AddApi()
    .AddApplication()
    .AddHttpClient();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.MapControllers();
await app.RunAsync();
