# TODO App — Angular Frontend

The frontend for the TODO application, developed using Angular, TypeScript, and SCSS.

It provides a responsive interface for managing TODO items through an ASP.NET Core Web API.

For complete application setup and backend architecture, see the [root README](../../README.md).

## Features

- Display TODO items
- Create new TODO items
- Delete existing TODO items
- Validate titles before submission
- Display loading and saving indicators
- Handle API errors
- Responsive layout
- Automated unit tests

## Technology Stack

- Angular standalone components
- TypeScript
- SCSS
- Angular Signals for reactive state management
- RxJS for asynchronous operations
- Angular HttpClient for API communication
- Vitest for unit testing

## Project Structure

```text
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── todo.service.ts
│   │       └── todo.service.spec.ts
│   ├── features/
│   │   └── todos/
│   │       ├── models/
│   │       │   └── todo.model.ts
│   │       └── components/
│   │           └── todo-list/
│   │               ├── todo-list.ts
│   │               ├── todo-list.html
│   │               ├── todo-list.scss
│   │               └── todo-list.spec.ts
│   ├── app.ts
│   ├── app.html
│   ├── app.scss
│   ├── app.spec.ts
│   └── app.config.ts
├── main.ts
├── index.html
└── styles.scss
```

## Prerequisites

- Node.js
- npm
- Angular-compatible development environment
- Running ASP.NET Core TODO API

## Installation

From the `frontend/todo-app` directory:

```bash
npm install
```

## Start Development Server

```bash
npm start
```

On Windows PowerShell, use:

```powershell
npm.cmd start
```

Navigate to:

http://localhost:4200

Angular automatically reloads the application when source files change.

## Backend Integration

The application communicates with the ASP.NET Core Web API at:

`https://localhost:7172/api/todos`

The API URL is configured in:

`src/app/core/services/todo.service.ts`

The Angular service exposes the following operations:

| Method | Description |
|---|---|
| getAll() | Retrieve all TODO items |
| getById(id) | Retrieve one TODO item |
| create(title) | Create a TODO item |
| delete(id) | Delete a TODO item |

Ensure the backend is running before testing API-dependent functionality.

If HTTPS certificate errors occur, trust the .NET development certificate:

```bash
dotnet dev-certs https --trust
```

## Component Design

### TodoList

The `TodoList` component manages the user interface and presentation state.

It uses Angular Signals to track:

- TODO items
- Loading state
- Saving state
- Items currently being deleted
- Error messages

### TodoService

`TodoService` encapsulates HTTP communication with the backend.

Keeping API communication in a separate service helps maintain separation of concerns and makes components easier to test.

### Todo Model

The frontend represents a TODO item using the following TypeScript interface:

```typescript
export interface Todo {
  id: string;
  title: string;
  createdAt: string;
}
```

## Validation

Before creating a TODO item, the frontend:

- Trims leading and trailing whitespace
- Rejects empty titles
- Rejects titles exceeding 200 characters
- Prevents duplicate submissions while saving

The backend independently validates incoming requests.

## Testing

Unit tests use Vitest and Angular testing utilities.

Run all tests:

```bash
npm test -- --watch=false
```

Or start the test runner in watch mode:

```bash
npm test
```

### Test Coverage

`todo.service.spec.ts` verifies HTTP requests, endpoints, and payloads using `HttpTestingController`.

`todo-list.spec.ts` verifies component initialization, loading, creation, deletion, validation, error handling, and rendering.

`app.spec.ts` verifies root application creation and rendering.

## Production Build

Build the Angular application:

```bash
npm run build
```

Angular generates production build artifacts in the configured output directory under `dist/`.

## Future Improvements

- TODO editing
- Completion status
- Search and filtering
- Pagination
- Environment-specific API configuration
- End-to-end tests
- Accessibility improvements

## Notes

This frontend is designed to work with the backend included in the same repository. Data is stored in memory by the backend and will be lost when the backend restarts.
