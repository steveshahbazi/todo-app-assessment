using System.Collections.Concurrent;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Infrastructure.Repositories;

public sealed class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<Guid, TodoItem> _todos = new();

    public Task<IReadOnlyCollection<TodoItem>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        IReadOnlyCollection<TodoItem> items = _todos.Values
            .OrderByDescending(todo => todo.CreatedAt)
            .ToList();

        return Task.FromResult(items);
    }

    public Task<TodoItem?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        _todos.TryGetValue(id, out var item);

        return Task.FromResult(item);
    }

    public Task AddAsync(
        TodoItem item,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!_todos.TryAdd(item.Id, item))
            throw new InvalidOperationException(
                $"A TODO with ID {item.Id} already exists.");

        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var deleted = _todos.TryRemove(id, out _);

        return Task.FromResult(deleted);
    }
}