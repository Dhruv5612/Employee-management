# Employee Management System — Requirements & Specifications

## 1. Project Overview
EmployeeHub is a full-stack, responsive Employee Management System designed for tracking workforce lifecycles, functional department structures, organizational headcount analytics, and role-based operational permissions.

## 2. Core Functional Modules

### Module 1: Employee Management
- **Automated Employee ID**: Sequentially generated business identifier formatted as `EMP-XXXXXX` (e.g. `EMP-001001`) via atomic counter.
- **Employee Attributes**:
  - Full Name (required, min 2, max 100)
  - Work Email (required, unique, normalized to lowercase)
  - Phone Number (required, normalized standard telephone format)
  - Department (required, foreign reference to existing Department)
  - Designation / Job Title (required, min 2, max 100)
  - Joining Date (required, valid date, cannot be in the future)
  - Employment Status (`Active`, `Inactive`, `On Leave`)
- **Operations**: Create, Read, Update, Delete, and Status modification.

### Module 2: Search, Filter, Sorting & Pagination
- **Search Query (`q`)**: Case-insensitive substring matching against Employee ID, Full Name, or Email.
- **Department Filter**: Filter staff by department reference ID.
- **Status Filter**: Filter staff by Active, Inactive, or On Leave.
- **Deterministic Sorting**: Sort by `name`, `joiningDate`, or `employeeId` in `asc` or `desc` order, backed by `_id: 1` secondary sort.
- **Pagination**: Configurable page size (5, 10, or 20 rows per page) with page navigation and count summaries.
- **URL Synchronization**: Query parameters stay synchronized in browser URL for bookmarking and state preservation.

### Module 3: Form & Data Validation
- Reusable form component supporting creation and editing.
- Instant client-side validation paired with strict server-side Zod validation schemas.
- Prevention of duplicate email registrations with database unique index safeguards.
- Destructive actions (deletions) protected by confirmation dialogs.

### Module 4: Dashboard & Headcount Analytics
- **Summary Metrics**:
  - Total Employees
  - Active Employees
  - Inactive Employees
  - On Leave Employees
  - Total Departments
- **Department Distribution Chart**: Recharts bar chart showing headcount per functional department, including empty departments (0 count).
- **Employment Status Chart**: Recharts doughnut chart illustrating Active, Inactive, and On-Leave proportions.

### Module 5: Department Management
- Attributes: Name (unique), Code (unique, uppercase), Description.
- Referential Integrity: Prevents deletion of any department that currently has assigned employees until they are reassigned.
- Bulk Employee Reassignment: Allows migrating staff from one department to another.

### Module 6: Authentication & Role-Based Authorization
- Roles: `Admin`, `HR`, and `Viewer`.
- Permissions:
  - Admin: Full system control, CRUD employees, CRUD departments, delete records.
  - HR: View, create, edit employees, update employment status, manage departments.
  - Viewer: Read-only access to directory and dashboard.
