# MongoDB Database Design Specification

Database Name: `employee_management`

## Collections & Schemas

### 1. `employees`
Stores complete identity, job assignment, and contact details for staff members.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Internal MongoDB Document ID |
| `employeeId` | String | Unique, Immutable, Required | Human-readable identifier (e.g., `EMP-001001`) |
| `fullName` | String | Required, Trimmed | Employee's full name (2–100 chars) |
| `email` | String | Unique, Required, Lowercase | Normalized work email |
| `phone` | String | Required, Trimmed | Standard phone format (max 20 chars) |
| `department` | ObjectId | Ref: 'Department', Required | Foreign key reference to Department collection |
| `designation`| String | Required, Trimmed | Role or title within company |
| `joiningDate`| Date | Required | Date joined; validated not in the future |
| `status` | String | Enum, Default: 'Active' | One of `['Active', 'Inactive', 'On Leave']` |
| `createdAt` | Date | Timestamp | Automatic ISO date |
| `updatedAt` | Date | Timestamp | Automatic ISO date |

**Indexes**:
- `{ employeeId: 1 }` (unique)
- `{ email: 1 }` (unique)
- `{ department: 1, status: 1 }` (compound filter index)
- `{ fullName: 1 }` (sort index)
- `{ joiningDate: -1 }` (sort index)

---

### 2. `departments`
Stores organizational business units and teams.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Internal MongoDB Document ID |
| `name` | String | Unique, Required | Department title (e.g., 'Engineering') |
| `code` | String | Unique, Required, Uppercase | Department abbreviation (e.g., 'ENG') |
| `description`| String | Optional, Max 500 | Description of business functions |
| `createdAt` | Date | Timestamp | Automatic ISO date |
| `updatedAt` | Date | Timestamp | Automatic ISO date |

**Indexes**:
- `{ name: 1 }` (unique)
- `{ code: 1 }` (unique)

---

### 3. `counters`
Dedicated collection for atomic sequence generation to prevent race conditions during concurrent ID creation.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | String | Primary Key | Identifier sequence key (e.g. `'employeeId'`) |
| `sequence` | Number | Required, Default: 0 | Current sequence counter integer |

---

### 4. `users`
Stores user identities, hashed passwords, and system roles for RBAC.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Internal MongoDB Document ID |
| `name` | String | Required | Full name of user |
| `email` | String | Unique, Lowercase, Required | Login email |
| `passwordHash` | String | Required, Select: false | bcrypt-hashed password string |
| `role` | String | Enum, Default: 'Viewer' | One of `['Admin', 'HR', 'Viewer']` |
| `isActive` | Boolean | Default: true | Account activation status |

---

### 5. `auditlogs`
Tracks modifications, creations, deletions, and actor identities for sensitive entity changes.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Internal MongoDB Document ID |
| `actor` | ObjectId | Ref: 'User', Nullable | User ID who executed the action |
| `action` | String | Required | Action label (e.g. `'EMPLOYEE_STATUS_UPDATED'`) |
| `entityType` | String | Required | `'Employee'`, `'Department'`, `'User'` |
| `entityId` | ObjectId | Required | ID of modified entity |
| `changes` | Mixed | Default: {} | Delta object showing before and after states |
| `createdAt` | Date | Default: Date.now | Timestamp of audit entry |
