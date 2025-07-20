# School Management System API

A Node.js-based RESTful API for managing students, classes and teachers in a school. This system supports enrollment, assignment management, student,class and teacher CRUD operations.

---

## Project Structure

```
school-management/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── main.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker-compose.yml
├── jest.config.js
├── config
└── README.md
```

---

## API Endpoints

### Student Routes

| Method | Path                         | Description                        |
|--------|------------------------------|------------------------------------|
| POST   | `/api/v1/students`           | Create a new student               |
| GET    | `/api/v1/students`           | Get all students                   |
| GET    | `/api/v1/students/:id`       | Get a specific student by ID       |
| PUT    | `/api/v1/students`           | Update student by ID (in body)     |
| DELETE | `/api/v1/students/:id`       | Delete student by ID               |
| PUT    | `/api/v1/students/enroll`    | Enroll a student into a class      |
| PUT    | `/api/v1/students/unenroll`  | Unenroll a student from a class    |

### Class Routes

| Method | Path                 | Description                 |
|--------|----------------------|-----------------------------|
| POST   | `/api/v1/classes`    | Create a new class          |
| GET    | `/api/v1/classes`    | Get all classes             |
| GET    | `/api/v1/classes/:id` | Get a specific class by ID |
| DELETE | `/api/v1/classes/:id` | Delete a class             |
| PUT    | `/api/v1/classes/assignTeacher`    | Assign a teacher into a class      |
| PUT    | `/api/v1/classes/unAssignTeacher`  | Un-assign a teacher from a class    |

### Teacher Routes

| Method | Path                         | Description                        |
|--------|------------------------------|------------------------------------|
| POST   | `/api/v1/teachers`           | Create a new teacher               |
| GET    | `/api/v1/teachers`           | Get all teachers                   |
| GET    | `/api/v1/teachers/:id`       | Get a specific teacher by ID       |
| PUT    | `/api/v1/teachers`           | Update teacher by ID (in body)     |
| DELETE | `/api/v1/teachers/:id`       | Delete teacher by ID               |


---

## Testing

This project uses **Jest** and **Supertest** with testing structured into:
- **Unit Tests**: isolated logic-level tests
- **Integration Tests**: component and database interaction
- **E2E Tests**: simulate full user behavior against Docker environment

---

## Available Scripts

### Script Descriptions

| Script               | Purpose                                                                 |
|----------------------|-------------------------------------------------------------------------|
| `npm start`          | Start the app in production mode                                        |
| `npm run dev`        | Start app with `nodemon` for development                                |                            |
| `npm run test:unit`  | Run only unit tests                                                     |
| `npm run test:student:integration` | Run integration tests for student APIs                    |
| `npm run e2e:test`   | Full cycle: setup Docker test env → run e2e → clean up               |


---

## Clean Up

To remove Docker test containers and volume data:

```bash
npm run docker:test:down
```