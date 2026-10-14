using TodoApp.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

// OpenAPI
builder.Services.AddOpenApi();

// Application dependencies
builder.Services.AddTodoServices();

// CORS
builder.Services.AddCors(options =>
    options.AddPolicy("AngularDev", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/openapi/v1.json",
            "Todo API v1");
    });
}

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseCors("AngularDev");

app.MapControllers();

app.Run();

public partial class Program { }