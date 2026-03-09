# Task Prioritization System

A full-stack web application designed to help users prioritize their tasks automatically based on urgency, importance, and required effort.

## Folder Structure

```
d:/Task_project/
│
├── backend/                   # Spring Boot REST API
│   ├── pom.xml                # Maven dependencies
│   └── src/main/java/com/tasksystem/backend/
│       ├── config/            # CORS Configuration
│       ├── controller/        # REST Controllers (API Endpoints)
│       ├── model/             # JPA Entities (Task)
│       ├── repository/        # Spring Data JPA Repositories
│       ├── service/           # Business Logic & Priority Calculation
│       └── TaskPrioritizationApplication.java # Main Application Class
│
├── frontend/                  # HTML/CSS/JS UI
│   ├── index.html             # Landing Page
│   ├── login.html             # Supabase Login
│   ├── register.html          # Supabase Registration
│   ├── dashboard.html         # Task Management UI
│   ├── css/
│   │   └── styles.css         # Clean, responsive styling
│   └── js/
│       ├── supabase-config.js # Supabase initialization
│       ├── auth.js            # Auth and user handling logic
│       └── app.js             # Main dashboard logic & API calls
│
└── database/
    └── schema.sql             # Example schema (JPA will auto-generate tables)
```

## Running the Project

### 1. Database Setup
Ensure MySQL is running. Create a database named `task_db`. Update the `application.properties` in `backend/src/main/resources` with your MySQL root username and password.

### 2. Backend (Spring Boot)
Open the `backend` folder in an IDE (IntelliJ IDEA, Eclipse, VS Code) or run via terminal using Maven:
```bash
cd backend
# On Windows:
.\mvnw.cmd spring-boot:run

# On Mac/Linux:
./mvnw spring-boot:run
```
The server will start at `http://localhost:8080`.

### 3. Frontend (Supabase Setup)
1. Go to [Supabase](https://supabase.com/) and create a project.
2. Under Authentication, enable Email/Password logic.
3. Under Project Settings > API, find your Project URL and anon key.
4. Open `frontend/js/supabase-config.js` and paste your Supabase URL and Anon Key.
5. Open `frontend/index.html` in your web browser (or serve using an extension like Live Server in VS Code).

## Example API Calls

The application uses REST API over `http://localhost:8080/api/tasks`.

### 1. Create a Task (POST)
**Endpoint:** `POST /api/tasks`

**Request Body (JSON):**
```json
{
  "taskName": "Complete Project Presentation",
  "deadline": "2026-03-15T15:00:00",
  "urgency": 5,
  "importance": 5,
  "effort": 3,
  "userId": "uuid-from-supabase"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "taskName": "Complete Project Presentation",
  "deadline": "2026-03-15T15:00:00",
  "urgency": 5,
  "importance": 5,
  "effort": 3,
  "priorityScore": 12,
  "status": "PENDING",
  "createdAt": "2026-03-09T18:00:00",
  "userId": "uuid-from-supabase"
}
```
*(Priority formula applied: (5 * 2) + 5 - 3 = 12)*

### 2. Get Tasks for a User (GET)
**Endpoint:** `GET /api/tasks?userId={user-id}`

**Response (200 OK):** It returns an array of tasks sorted automatically by `priority_score` descending.
```json
[
  {
    "id": 1,
    "taskName": "Complete Project Presentation",
    "priorityScore": 12,
    "status": "PENDING",
    ...
  },
  {
     "id": 2,
     "taskName": "Reply to emails",
     "priorityScore": 4,
     "status": "COMPLETED",
     ...
  }
]
```

### 3. Update a Task (PUT)
**Endpoint:** `PUT /api/tasks/1`

**Request Body (JSON):** *(Replace entire task payload)*
```json
{
  "taskName": "Complete Project Presentation - Update",
  "urgency": 5,
  "importance": 5,
  "effort": 2,
  "status": "COMPLETED",
  "userId": "uuid-from-supabase"
}
```

### 4. Delete a Task (DELETE)
**Endpoint:** `DELETE /api/tasks/1`

**Response:** `204 No Content`
