# EmployeeHub — Employee Management System

A full-stack, responsive Employee Management System built with **React (JavaScript / JSX)**, **Node.js + Express (JavaScript / ES Modules)**, and **MongoDB (Mongoose)**.

---

## 🌟 Key Features

1. **Employee Management**:
   - Automated, atomic sequential Employee ID generation (`EMP-001001`, `EMP-001002`, ...).
   - Complete CRUD operations: View, Add, Edit, Delete, and Change Employment Status.
   - Comprehensive validation (phone normalization, case-insensitive email uniqueness, non-future joining dates).
2. **Search, Filtering, Sorting & Pagination**:
   - Multi-field search across Name, Email, and Employee ID.
   - Filter by Department and Employment Status (`Active`, `Inactive`, `On Leave`).
   - Deterministic sorting by Name, Joining Date, and Employee ID.
   - Page sizes: 5, 10, or 20 records with full pagination metadata.
   - Filter state synchronized with URL query parameters for bookmarkable searches.
3. **Executive Dashboard & Analytics**:
   - 5 KPI Stat Cards: Total Employees, Active, Inactive, On Leave, Total Departments.
   - Recharts Department Distribution Bar Chart (including 0-count departments).
   - Recharts Employment Status Donut Chart.
4. **Department Management**:
   - Department CRUD with unique Name and Code validation.
   - Referential integrity: Prevents accidental deletion of departments with assigned employees.
   - Staff Reassignment Modal to migrate employees between departments.
5. **Authentication & Role-Based Access Control (RBAC)**:
   - Roles: `Admin`, `HR`, and `Viewer`.
   - JWT token authentication.
   - One-click demo login buttons for instant evaluation.
6. **Zero-Configuration In-Memory & Live MongoDB Support**:
   - Automatically connects to your local or Atlas MongoDB (`MONGODB_URI`).
   - Automatically falls back to embedded in-memory MongoDB in development mode if no external MongoDB server is running.
   - Client includes a Demo Mode toggle backed by localStorage for offline presentations.

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 (JavaScript / JSX), Vite |
| **Styling** | Vanilla CSS Design System with CSS Tokens (`variables.css` & `globals.css`) |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend** | Node.js (ES Modules), Express |
| **Database** | MongoDB with Mongoose ODM |
| **Validation** | Zod (Backend) & Client-side field validations |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |

---

## 📁 Project Architecture

```
employee-management/
├── client/                         # React Frontend (Vite)
│   ├── src/
│   │   ├── app/                    # App entry, router, and providers
│   │   ├── components/             # Reusable UI (Buttons, Modals, Tables, Toast)
│   │   ├── features/
│   │   │   ├── auth/               # Login, protected routes, auth API
│   │   │   ├── dashboard/          # Metrics cards, Recharts visualizations
│   │   │   ├── departments/        # Department CRUD, reassign modal
│   │   │   └── employees/          # Directory, filters, forms, status menus
│   │   ├── hooks/                  # useToast, useDebounce, usePagination
│   │   ├── services/               # Axios client and mock demo adapter
│   │   ├── styles/                 # CSS Design System
│   │   └── utils/                  # Date helpers, query params, formatters
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Express Backend (Node.js ES Modules)
│   ├── src/
│   │   ├── config/                 # DB connection with in-memory fallback
│   │   ├── controllers/            # HTTP request/response handling
│   │   ├── middleware/             # Auth, validation, error handler
│   │   ├── models/                 # Employee, Department, User, Counter, AuditLog
│   │   ├── routes/                 # Express REST endpoints (/api/v1)
│   │   ├── seed/                   # Initial users, departments, employees
│   │   ├── services/               # Business rules and database operations
│   │   ├── utils/                  # ID generator, ApiError, asyncHandler
│   │   ├── validators/             # Zod validation schemas
│   │   ├── app.js                  # Express app configuration
│   │   └── server.js               # Server entry point
│   └── package.json
│
├── docs/                           # Documentation
│   ├── requirements.md
│   ├── database-design.md
│   ├── api-documentation.md
│   └── test-cases.md
│
├── package.json                    # Monorepo root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Installation
Install all dependencies for both client and server:
```bash
# From the project root
npm run install:all
```

### 2. Running the Application

In one terminal, start the Express backend server:
```bash
npm run dev:server
# Server runs at http://localhost:5000 (API prefix: /api/v1)
```

In a second terminal, start the React frontend:
```bash
npm run dev:client
# Frontend runs at http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@company.com` | `admin123` | Full access (CRUD employees, departments, delete records) |
| **HR** | `hr@company.com` | `hr12345` | Manage employees, update status, manage departments |
| **Viewer** | `viewer@company.com` | `viewer123` | Read-only access to directory and dashboard |

*One-click login buttons for all three accounts are available directly on the login page.*
