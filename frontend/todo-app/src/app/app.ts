import { Component, signal } from '@angular/core';
import { TodoList } from './features/todos/components/todo-list/todo-list';


@Component({
  imports: [TodoList],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('todo-app');
}
