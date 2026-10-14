import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { TodoService } from '../../../../core/services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss'
})
export class TodoList implements OnInit {
  private readonly todoService = inject(TodoService);

  readonly todos = signal<Todo[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deletingIds = signal<Set<string>>(new Set());
  readonly errorMessage = signal<string | null>(null);

  newTitle = '';

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.todoService.getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (todos) => this.todos.set(todos),
        error: () => {
          this.errorMessage.set('Failed to load TODOs. Please try again.');
        }
      });
  }

  addTodo(): void {
    const title = this.newTitle.trim();

    if (!title || title.length > 200 || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    this.todoService.create(title)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (todo) => {
          this.todos.update(items => [todo, ...items]);
          this.newTitle = '';
        },
        error: () => {
          this.errorMessage.set('Failed to create TODO. Please try again.');
        }
      });
  }

  deleteTodo(id: string): void {
    if (this.deletingIds().has(id)) {
      return;
    }

    this.deletingIds.update(ids => new Set([...ids, id]));
    this.errorMessage.set(null);

    this.todoService.delete(id)
      .pipe(finalize(() => {
        this.deletingIds.update(ids => {
          const updated = new Set(ids);
          updated.delete(id);
          return updated;
        });
      }))
      .subscribe({
        next: () => {
          this.todos.update(items => items.filter(todo => todo.id !== id));
        },
        error: () => {
          this.errorMessage.set('Failed to delete TODO. Please try again.');
        }
      });
  }
}