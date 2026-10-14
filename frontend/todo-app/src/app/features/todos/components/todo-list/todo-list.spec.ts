import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { TodoList } from './todo-list';
import { TodoService } from '../../../../core/services/todo.service';
import { Todo } from '../../models/todo.model';

describe('TodoList', () => {
  let component: TodoList;
  let fixture: ComponentFixture<TodoList>;

  let todoServiceMock: {
    getAll: ReturnType<typeof vi.fn>;
    getById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockTodo: Todo = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Learn Angular',
    createdAt: '2026-10-14T06:00:00Z'
  };

  beforeEach(async () => {
    // Create mocked methods for TodoService
    todoServiceMock = {
      getAll: vi.fn().mockReturnValue(of([mockTodo])),
      getById: vi.fn(),
      create: vi.fn(),
      delete: vi.fn()
    };

    // Configure Angular testing module
    await TestBed.configureTestingModule({
      imports: [TodoList],
      providers: [
        {
          provide: TodoService,
          useValue: todoServiceMock
        }
      ]
    }).compileComponents();

    // Create component instance
    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;

    // Trigger ngOnInit and initial change detection
    fixture.detectChanges();
  });

  // --------------------------------------------------
  // Component initialization
  // --------------------------------------------------

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load TODOs on initialization', () => {
    expect(todoServiceMock.getAll).toHaveBeenCalled();
    expect(component.todos()).toEqual([mockTodo]);
  });

  // --------------------------------------------------
  // Create TODO
  // --------------------------------------------------

  it('should add a new TODO', () => {
    const newTodo: Todo = {
      ...mockTodo,
      id: '223e4567-e89b-12d3-a456-426614174000',
      title: 'Build TODO App'
    };

    todoServiceMock.create.mockReturnValue(of(newTodo));

    component.newTitle = 'Build TODO App';
    component.addTodo();

    expect(todoServiceMock.create)
      .toHaveBeenCalledWith('Build TODO App');

    expect(component.todos()).toContainEqual(newTodo);
    expect(component.newTitle).toBe('');
  });

  it('should not add a TODO with an empty title', () => {
    component.newTitle = '   ';
    component.addTodo();

    expect(todoServiceMock.create).not.toHaveBeenCalled();
  });

  it('should trim whitespace before creating a TODO', () => {
    const newTodo: Todo = {
      ...mockTodo,
      id: '323e4567-e89b-12d3-a456-426614174000',
      title: 'New task'
    };

    todoServiceMock.create.mockReturnValue(of(newTodo));

    component.newTitle = '   New task   ';
    component.addTodo();

    expect(todoServiceMock.create)
      .toHaveBeenCalledWith('New task');
  });

  it('should not add a TODO longer than 200 characters', () => {
    component.newTitle = 'A'.repeat(201);
    component.addTodo();

    expect(todoServiceMock.create).not.toHaveBeenCalled();
  });

  // --------------------------------------------------
  // Delete TODO
  // --------------------------------------------------

  it('should delete an existing TODO', () => {
    todoServiceMock.delete.mockReturnValue(of(void 0));

    component.deleteTodo(mockTodo.id);

    expect(todoServiceMock.delete)
      .toHaveBeenCalledWith(mockTodo.id);

    expect(component.todos()).not.toContainEqual(mockTodo);
  });

  it('should not delete the same TODO while deletion is in progress', () => {
    // Mark the item as currently being deleted
    component.deletingIds.set(new Set([mockTodo.id]));

    component.deleteTodo(mockTodo.id);

    expect(todoServiceMock.delete).not.toHaveBeenCalled();
  });

  // --------------------------------------------------
  // Error handling
  // --------------------------------------------------

  it('should display an error when loading fails', () => {
    todoServiceMock.getAll.mockReturnValue(
      throwError(() => new Error('API unavailable'))
    );

    component.loadTodos();

    expect(component.errorMessage()).toBe(
      'Failed to load TODOs. Please try again.'
    );

    expect(component.loading()).toBe(false);
  });

  it('should display an error when creating fails', () => {
    todoServiceMock.create.mockReturnValue(
      throwError(() => new Error('Creation failed'))
    );

    component.newTitle = 'New task';
    component.addTodo();

    expect(component.errorMessage()).toBe(
      'Failed to create TODO. Please try again.'
    );

    expect(component.saving()).toBe(false);
  });

  it('should display an error when deletion fails', () => {
    todoServiceMock.delete.mockReturnValue(
      throwError(() => new Error('Deletion failed'))
    );

    component.deleteTodo(mockTodo.id);

    expect(component.errorMessage()).toBe(
      'Failed to delete TODO. Please try again.'
    );

    expect(component.todos()).toContainEqual(mockTodo);

    expect(component.deletingIds().has(mockTodo.id)).toBe(false);
  });

  // --------------------------------------------------
  // UI rendering
  // --------------------------------------------------

  it('should display TODO titles in the template', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Learn Angular');
  });

  it('should display the correct number of TODOs', () => {
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Tasks (1)');
  });

  it('should display an empty state when there are no TODOs', () => {
    component.todos.set([]);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('No TODOs yet.');
  });
});