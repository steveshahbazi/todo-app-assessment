using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Entities;
namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/todos")]
public sealed class TodosController(ITodoService todos) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TodoItem>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TodoItem>>> GetAll() =>
        Ok(await todos.GetAllAsync());

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(TodoItem), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoItem>> GetById(Guid id)
    {
        var todo = await todos.GetByIdAsync(id);
        return todo is null ? NotFound() : Ok(todo);
    }

    [HttpPost]
    [ProducesResponseType(typeof(TodoItem), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoItem>> Create([FromBody] CreateTodoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]> { [nameof(request.Title)] = ["Title cannot be blank."] }));
        var item = await todos.CreateAsync(request.Title);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id) =>
        await todos.DeleteAsync(id) ? NoContent() : NotFound();
}
