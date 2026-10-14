using TodoApp.Application.Interfaces;
using TodoApp.Application.Services;
using TodoApp.Infrastructure.Repositories;
namespace TodoApp.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddTodoServices(this IServiceCollection services)
    {
        services.AddSingleton<ITodoRepository, InMemoryTodoRepository>();
        services.AddScoped<ITodoService, TodoService>();
        return services;
    }
}
