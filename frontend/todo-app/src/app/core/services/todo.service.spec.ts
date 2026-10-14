import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { TodoService } from './todo.service';
import { Todo } from '../../features/todos/models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://localhost:7172/api/todos';

  const mockTodo: Todo = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Learn Angular',
    createdAt: '2026-10-14T06:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all TODOs', () => {
    service.getAll().subscribe(todos => {
      expect(todos).toEqual([mockTodo]);
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('GET');

    request.flush([mockTodo]);
  });

  it('should retrieve a TODO by ID', () => {
    service.getById(mockTodo.id).subscribe(todo => {
      expect(todo).toEqual(mockTodo);
    });

    const request = httpMock.expectOne(`${apiUrl}/${mockTodo.id}`);

    expect(request.request.method).toBe('GET');

    request.flush(mockTodo);
  });

  it('should create a TODO', () => {
    service.create('Learn Angular').subscribe(todo => {
      expect(todo).toEqual(mockTodo);
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      title: 'Learn Angular'
    });

    request.flush(mockTodo);
  });

  it('should delete a TODO', () => {
    service.delete(mockTodo.id).subscribe();

    const request = httpMock.expectOne(`${apiUrl}/${mockTodo.id}`);

    expect(request.request.method).toBe('DELETE');

    request.flush(null, {
      status: 204,
      statusText: 'No Content'
    });
  });
});