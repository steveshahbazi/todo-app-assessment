using System.ComponentModel.DataAnnotations;
namespace TodoApp.Api.DTOs;

public sealed class CreateTodoRequest
{
    [Required(AllowEmptyStrings = false)]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; init; } = string.Empty;
}
