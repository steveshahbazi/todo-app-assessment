using System;
using System.Threading.Tasks;
using TodoApp.Application.Services;
using TodoApp.Infrastructure.Repositories;
using Xunit;

namespace TodoApp.Tests;

public sealed class TodoServiceTests
{
    [Fact]
    public async Task Create_TrimsTitle_AndPersistsItem()
    {
        var service = new TodoService(new InMemoryTodoRepository());
        var created = await service.CreateAsync("  Buy milk  ");
        Assert.Equal("Buy milk", created.Title);
        Assert.Equal(created.Id, Assert.Single(await service.GetAllAsync()).Id);
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    public async Task Create_RejectsBlankTitle(string title)
    {
        var service = new TodoService(new InMemoryTodoRepository());
        await Assert.ThrowsAsync<ArgumentException>(() => service.CreateAsync(title));
    }

    [Fact]
    public async Task Delete_RemovesExistingItem_AndReturnsFalseForMissingItem()
    {
        var service = new TodoService(new InMemoryTodoRepository());
        var item = await service.CreateAsync("A task");
        Assert.True(await service.DeleteAsync(item.Id));
        Assert.False(await service.DeleteAsync(item.Id));
        Assert.Empty(await service.GetAllAsync());
    }

    [Fact]
    public async Task Create_RejectsOverlongTitle()
    {
        var service = new TodoService(new InMemoryTodoRepository());
        await Assert.ThrowsAsync<ArgumentException>(() => service.CreateAsync(new string('x', 201)));
    }
}
