using CaseManagement.Api;
using CaseManagement.Api.Data;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddOpenApi();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddDatabaseContext(builder.Configuration);


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CaseManagementDbContext>();
    dbContext.Database.EnsureCreated();
    CaseManagementDbSeeder.Seed(dbContext);
}

// Configure the HTTP request pipeline.

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();
app.MapOpenApi();
app.MapScalarApiReference("/scalar");
app.MapGet("/", () => Results.Redirect("/scalar"));

app.Run();
