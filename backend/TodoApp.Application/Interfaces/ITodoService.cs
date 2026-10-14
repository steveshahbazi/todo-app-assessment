using TodoApp.Domain.Entities;

namespace TodoApp.Application.Interfaces;

public interface ITodoService
{
    Task<IReadOnlyList<TodoItem>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<TodoItem?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<TodoItem> CreateAsync(
        string title,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}