# Employee Management System — REST API Documentation

Base URL: `http://localhost:5000/api/v1`

All mutating endpoints require an `Authorization: Bearer <token>` header obtained from `/auth/login`.

---

## 1. Authentication Endpoints

### POST `/auth/login`
Authenticates a user and returns a signed JWT access token.

**Request Body**:
```json
{
  "email": "admin@company.com",
  "password": "admin123"
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "user": {
      "id": "6ae0e35139b2ba7f0b4a940d",
      "name": "Admin User",
      "email": "admin@company.com",
      "role": "Admin"
    }
  }
}
```

### GET `/auth/me`
Returns current authenticated user profile and permissions.

---

## 2. Employee Endpoints

### GET `/employees`
List, search, filter, sort, and paginate employee records.

**Query Parameters**:
- `q`: Search string matching employee ID, full name, or email.
- `department`: Filter by department ObjectId.
- `status`: Filter by `Active`, `Inactive`, or `On Leave`.
- `sortBy`: `name`, `joiningDate`, `employeeId`, `createdAt`.
- `order`: `asc` or `desc`.
- `page`: Page index (default: `1`).
- `limit`: Records per page (`5`, `10`, or `20`; default: `10`).

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "6ae0e35239b2ba7f0b4a9422",
      "employeeId": "EMP-001006",
      "fullName": "Aisha Al-Mansoor",
      "email": "aisha.m@company.com",
      "phone": "+1 (555) 789-0123",
      "department": {
        "_id": "6ae0e35239b2ba7f0b4a9418",
        "name": "Marketing",
        "code": "MKT"
      },
      "designation": "Content & Growth Strategist",
      "joiningDate": "2024-02-14T00:00:00.000Z",
      "status": "Active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalRecords": 13,
    "totalPages": 2
  }
}
```

### POST `/employees`
Create a new employee record. Requires `Admin` or `HR` role.

**Request Body**:
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@company.com",
  "phone": "+1 (555) 019-2834",
  "department": "6ae0e35239b2ba7f0b4a9414",
  "designation": "Senior Engineer",
  "joiningDate": "2024-01-15",
  "status": "Active"
}
```

**Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "_id": "6ae0e4395415e146bf9d4ec",
    "employeeId": "EMP-001014",
    "fullName": "Jane Doe",
    "email": "jane.doe@company.com",
    "status": "Active"
  }
}
```

### PATCH `/employees/:id`
Updates employee details.

### PATCH `/employees/:id/status`
Updates employment status (`Active`, `Inactive`, or `On Leave`).

### DELETE `/employees/:id`
Deletes an employee record. Requires `Admin` role.

---

## 3. Department Endpoints

### GET `/departments`
List all departments with aggregated live employee counts.

### POST `/departments`
Create a new department (`name` and `code` must be unique).

### DELETE `/departments/:id`
Deletes a department. If `employeeCount > 0`, returns HTTP 409 Conflict instructing to reassign employees first.

### POST `/departments/:id/reassign-employees`
Transfers all employees from source department to `targetDepartmentId`.

---

## 4. Dashboard Endpoints

### GET `/dashboard/stats`
Returns total employee headcount, active, inactive, on-leave, and department counts.

### GET `/dashboard/departments`
Returns department-wise distribution including departments with 0 assigned staff.

### GET `/dashboard/status`
Returns status breakdown for charts.
