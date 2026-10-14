using System;
using System.Collections.Generic;
using System.Text;

namespace TodoApp.Domain.Entities;
public sealed record TodoItem(Guid Id, string Title, DateTimeOffset CreatedAt);
