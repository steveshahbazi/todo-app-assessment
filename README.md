# TODO Application

A full-stack TODO management application built using ASP.NET Core Web API and Angular.

The application allows users to create, view, and delete TODO items through a responsive web interface. It demonstrates a layered backend architecture, dependency injection, asynchronous APIs, in-memory data storage, and automated testing.

## Features

- View all TODO items, ordered by creation date (newest first)
- Create TODO items with title validation
- Delete existing TODO items
- Responsive Angular user interface
- Loading indicators and error handling
- RESTful API with appropriate HTTP status codes
- Interactive API documentation using Swagger UI
- Automated unit tests

## Technology Stack

**Backend**
- C# and ASP.NET Core Web API
- .NET
- Dependency Injection
- In-memory storage using ConcurrentDictionary
- OpenAPI and Swagger UI
- xUnit for backend testing

**Frontend**
- Angular with standalone components
- TypeScript
- SCSS
- Angular Signals
- RxJS
- Angular HttpClient
- Vitest for unit testing

## Project Structure

```text
todo-app-assessment/
├── backend/
│   ├── TodoApp.Api/
│   ├── TodoApp.Application/
│   ├── TodoApp.Domain/
│   ├── TodoApp.Infrastructure/
│   └── TodoApp.Tests/
├── frontend/
│   └── todo-app/
├── .gitignore
└── README.md
```

### Backend Architecture

The backend follows a layered architecture with separation of concerns.

| Project | Responsibility |
|---|---|
| TodoApp.Api | HTTP endpoints, request validation, API configuration and dependency injection |
| TodoApp.Application | Business logic and service/repository interfaces |
| TodoApp.Domain | Domain entities |
| TodoApp.Infrastructure | In-memory repository implementation |
| TodoApp.Tests | Automated backend tests |

The API depends on application abstractions, while infrastructure provides the repository implementation.

## Prerequisites

Install the following tools:

- .NET SDK compatible with the backend target framework
- Node.js and npm compatible with the Angular version
- Git
- Visual Studio, VS Code, or another compatible IDE

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-app-assessment
```

Replace `<repository-url>` with the GitHub repository URL.

### 2. Run the Backend

Navigate to the backend directory:

```bash
cd backend
```

Restore dependencies:

```bash
dotnet restore
```

Build the solution:

```bash
dotnet build
```

Start the API:

```bash
dotnet run --project TodoApp.Api
```

The API is configured for local development using:

- HTTPS: https://localhost:7172
- HTTP: http://localhost:5100

Swagger UI is available in the Development environment at:

https://localhost:7172/swagger

If the browser reports a development certificate warning, trust the .NET development certificate:

```bash
dotnet dev-certs https --trust
```

### 3. Run the Frontend

Open a second terminal from the repository root.

```bash
cd frontend/todo-app
npm install
npm start
```

On Windows PowerShell, `npm.cmd start` can be used if script execution restrictions prevent `npm` from running.

Open:

http://localhost:4200

The Angular application communicates with the ASP.NET Core API.

Both applications must be running for full functionality.

## API Endpoints

Base URL:

`https://localhost:7172/api/todos`

| Method | Endpoint | Description | Success Response |
|---|---|---|---|
| GET | /api/todos | Retrieve all TODO items | 200 OK |
| GET | /api/todos/{id} | Retrieve a TODO by ID | 200 OK |
| POST | /api/todos | Create a TODO | 201 Created |
| DELETE | /api/todos/{id} | Delete a TODO | 204 No Content |

Requests for nonexistent TODO items return `404 Not Found`.

### Example: Create TODO

Request:

```http
POST /api/todos
Content-Type: application/json
```

```json
{
  "title": "Learn Angular"
}
```

Example response:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Learn Angular",
  "createdAt": "2026-10-14T06:00:00Z"
}
```

TODO titles are required, whitespace is trimmed, and titles must not exceed 200 characters.

## Data Storage

The application uses an in-memory repository backed by `ConcurrentDictionary`.

This approach keeps the project lightweight and eliminates the need for database configuration.

**Important:** TODO items are not persisted. All data is lost when the backend application restarts.

The repository abstraction allows a persistent implementation to be introduced later without changing the application service interface.

## Testing

### Backend

From the backend directory:

```bash
dotnet test
```

### Frontend

From `frontend/todo-app`:

```bash
npm test -- --watch=false
```

The frontend tests cover:

- API request methods and payloads
- Component initialization
- Loading TODO items
- Creating and deleting TODO items
- Input validation
- Error handling
- UI rendering

## Development Notes

- Angular runs on port 4200 by default.
- The backend CORS policy allows requests from `http://localhost:4200`.
- The frontend API URL is configured in `src/app/core/services/todo.service.ts`.
- Swagger UI is enabled in the Development environment.
- The backend repository is registered as a singleton so TODO items remain available across requests while the application is running.

## Future Improvements

- Persistent database storage using Entity Framework Core
- Authentication and authorization
- Editing TODO items
- Completion status and filtering
- Pagination
- Docker support
- CI/CD pipeline

## License

This project is provided for demonstration and educational purposes.
