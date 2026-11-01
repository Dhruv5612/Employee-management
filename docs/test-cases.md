# Employee Management System — Test Cases & Validation Matrix

## 1. Acceptance Checklist Verification

| Requirement | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **Employee ID Generation** | Create new employee via API/UI | Backend generates sequential `EMP-XXXXXX` atomically via Counter | PASS |
| **Email Normalization & Uniqueness** | Submit employee with existing email (case variant) | Returns HTTP 409 Conflict with duplicate email message | PASS |
| **Phone Validation** | Submit invalid phone format | Validation rejects with field error message | PASS |
| **Future Joining Date** | Enter future date as joining date | Validation rejects: "Joining date cannot be in the future" | PASS |
| **Department Existence** | Submit non-existent department ObjectId | Returns HTTP 400 with invalid department message | PASS |
| **Employment Status Enum** | Submit invalid status | Only `Active`, `Inactive`, and `On Leave` accepted | PASS |
| **Delete Confirmation** | Click delete on employee row | Confirmation modal appears before sending DELETE request | PASS |
| **Assigned Department Integrity** | Delete department with assigned staff | Blocked with HTTP 409 Conflict requiring reassignment first | PASS |
| **Role-Based Authorization** | Viewer attempts POST/PATCH/DELETE | HTTP 403 Forbidden returned by backend middleware | PASS |
| **Search & Filters Integration** | Filter by Dept, Status, and search query together | Backend applies all filters simultaneously with correct count | PASS |
| **Deterministic Sorting** | Sort by name asc/desc with pagination | Order is consistent across page boundaries using `_id: 1` secondary sort | PASS |
| **Page Size Restriction** | Set limit parameter to 5, 10, or 20 | Table renders exact number of rows with matching pagination meta | PASS |
| **Dashboard Synchronization** | Add/edit/status change an employee | Dashboard counters and Recharts graphs update accurately | PASS |

---

## 2. Automated Integration Test Suite

The backend test suite (`server/tests/`) contains:
1. `departments.test.js`: Department creation, unique code verification, role authorization, and list aggregations.
2. `employees.test.js`: Sequential employeeId generation, duplicate email rejection, future date prevention, and search filters.
3. `dashboard.test.js`: Overall headcount statistics calculations and inclusion of 0-count departments in distribution.
