using DapperCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDapperCore(builder.Configuration.GetConnectionString("DefaultConnection")!);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Run();

