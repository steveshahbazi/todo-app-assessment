using System.Linq;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Services;

public sealed class TodoService(ITodoRepository repository) : ITodoService
{
    public async Task<IReadOnlyList<TodoItem>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var items = await repository.GetAllAsync(cancellationToken);
        return items.ToList();
    }

    public Task<TodoItem?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
        => repository.GetByIdAsync(id, cancellationToken);

    public async Task<TodoItem> CreateAsync(
        string title,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException(
                "A title is required.", nameof(title));

        var normalized = title.Trim();

        if (normalized.Length > 200)
            throw new ArgumentException(
                "The title must be 200 characters or fewer.", nameof(title));

        var item = new TodoItem(
            Guid.NewGuid(),
            normalized,
            DateTimeOffset.UtcNow);

        await repository.AddAsync(item, cancellationToken);

        return item;
    }

    public Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);
}