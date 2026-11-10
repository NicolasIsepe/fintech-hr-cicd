# Fintech HR — Backend

REST API for managing employee records for the Fintech HR project — registration, lookup, updates, and status tracking through the hiring pipeline.

## Tech Stack

- **Java 21**
- **Spring Boot 4.1.0** (Spring Web MVC)
- **Lombok** — reduces model/DTO boilerplate
- **Jackson** — JSON serialization
- **Maven** (via the included wrapper, `mvnw`)
- **JUnit 5 + Mockito + MockMvc** — testing
- **Docker** — multi-stage build for containerized deployment

Data is currently held in an in-memory store (no external database yet), so records reset whenever the application restarts.

## Getting Started

### Prerequisites

- JDK 21+
- No local Maven install needed — use the bundled `./mvnw` wrapper

### Run locally

```bash
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### Run tests

```bash
./mvnw test
```

### Run with Docker

```bash
docker build -t fintech-hr-backend .
docker run -p 8080:8080 fintech-hr-backend
```

## API Reference

Base path: `/employees`

| Method | Endpoint          | Description                            |
|--------|-------------------|------------------------------------------|
| GET    | `/employees`      | List all employees                       |
| GET    | `/employees/{id}` | Get a single employee by ID              |
| POST   | `/employees`      | Create a new employee                    |
| PUT    | `/employees/{id}` | Replace an employee's full record        |
| PATCH  | `/employees/{id}` | Partially update an employee's record    |
| DELETE | `/employees/{id}` | Delete an employee                       |

### Employee object

```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+55 11 91234-5678",
  "role": "Backend Engineer",
  "department": "Engineering",
  "salary": 12000.00,
  "city": "São Paulo",
  "status": "IN_ANALYSIS"
}
```

`status` accepts one of: `IN_ANALYSIS`, `APPROVED`, `REJECTED`, `HIRED`.

### Error responses

Errors are returned as a consistent JSON body:

```json
{
  "timestamp": "2026-08-27T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Employee with id '42' could not be found",
  "path": "/employees/42"
}
```

Handled cases include missing/invalid employees (404), malformed JSON or invalid enum values (400), missing query parameters (400), unsupported HTTP methods (405), and unexpected server errors (500).

## CORS

Cross-origin requests are enabled for:
- `https://fintech-hr.onrender.com`
- `http://localhost:3000`

Update `WebConfig` if the frontend origin changes.

## License

Distributed under the [MIT License](./LICENSE).