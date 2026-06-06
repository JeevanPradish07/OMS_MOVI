# 🚀 Organization Management System (OMS)

A highly advanced, enterprise-grade SaaS platform designed to streamline corporate workflows. OMS acts as the central nervous system for an organization, seamlessly uniting System Administration, Human Resources (HR), Project Management Offices (PMO), and Employees into a single, cohesive, and isolated ecosystem.

---

## 🛠️ Comprehensive Tech Stack

OMS leverages modern web technologies to ensure a scalable, highly responsive, and beautiful user experience.

- **Frontend Environment:**
  - **Framework:** React.js bootstrapped with Vite for lightning-fast HMR and optimized production builds.
  - **Routing:** React Router v6 for dynamic, role-based client-side routing.
  - **Styling:** Tailwind CSS for a highly customized, scalable design system without external component bloat.
  - **Iconography:** Google Material Symbols (Variable fonts) for crisp, premium icons.
- **Backend Architecture:**
  - **Runtime:** Node.js.
  - **Framework:** Express.js providing robust RESTful APIs.
- **Database Layer:**
  - **Database:** MongoDB (NoSQL).
  - **ODM:** Mongoose for strict schema validation, relationships, and queries.
- **Security:**
  - **Authentication:** JWT (JSON Web Tokens) securely stored in HTTP-only cookies or local storage.
  - **Authorization:** Strict Role-Based Access Control (RBAC) utilizing an Access Matrix paradigm.

---

## 🏗️ Folder Structure

```text
OMS/
├── backend/
│   ├── config/          # MongoDB connections, env variables
│   ├── controllers/     # Route logic (Auth, Users, Projects, Tasks)
│   ├── models/          # Mongoose Schemas (User, Project, Role, Task, etc.)
│   ├── routes/          # Express route definitions
│   ├── middleware/      # JWT verification, RBAC guard middleware
│   └── server.js        # Entry point
└── frontend/
    ├── public/          # Static assets
    ├── src/
    │   ├── api/         # Axios interceptors and endpoint definitions
    │   ├── components/  # Reusable UI (Sidebar, PageWrapper, Modal, StatusBadge)
    │   ├── contexts/    # React Context (AuthContext for global user state)
    │   ├── pages/       # Role-based views (Admin, HR, PMO, Intern)
    │   ├── App.jsx      # Main router and route protection logic
    │   └── index.css    # Tailwind directives and custom scrollbar CSS
```

---

## 🏛️ Role-Based Architecture & Core Workflows

OMS strictly partitions functionality based on user roles. The system routes users to completely different environments, ensuring zero data overlap and maximum security.

### 1. 🛡️ The Admin (System Administration)
The Admin holds the "God View" of the entire system. Their dashboard is focused on security, infrastructure, and access management.
- **Access Matrix & Permissions:** Admins can dynamically toggle Create, Read, Update, and Delete (CRUD) permissions for specific roles across specific modules.
- **User & Department Management:** Admins create top-level departments (e.g., Engineering, HR, Finance) and seed user accounts.
- **Immutable Audit Logs:** Every critical action (login, task creation, project deletion) is tracked in the database and visible to the Admin for security compliance.
- **System Reports:** High-level metrics on system usage and active sessions.

### 2. 👥 HR (Human Resources)
HR is responsible for managing the **People**. They do not manage project deliverables; they manage employee welfare, compliance, and attendance.
- **Global Employee Directory:** Full access to view all active employees and interns across the organization.
- **Attendance & Leave Management:** Tracking who clocked in, leave requests, and overall availability.
- **Performance Appraisals:** End-of-year or quarterly reviews based on input from PMOs.
- **HR Task Board:** A Kanban board dedicated to administrative tasks (e.g., "Update Onboarding Docs", "Process Payroll") assigned to HR interns or staff.

### 3. 🎯 PMO (Project Management Office)
PMO is strictly responsible for managing **Projects, Deliverables, and Timelines**.
- **The "Isolated Team" Workflow:** 
  1. A PMO clicks **"New Project"** to launch the Multi-Step Project Wizard.
  2. **Step 1:** They enter project metadata (Code, Name, Due Date) and *assign an HR Representative* to oversee the team's compliance and welfare.
  3. **Step 2 (Resource Request):** The PMO defines exactly what they need (e.g., "2 Frontend Developers, 1 Full Stack Intern").
  4. **Step 3 (Team Assembly):** The PMO browses the global company directory and manually selects specific employees to fulfill those requests.
  5. **Isolation:** The selected employees are now pulled into an **Isolated Project Team**. The PMO has full authority over their tasks within this context.
- **PMO Task Assignment Board:** A Project-scoped Kanban board where PMOs create deliverables, assign effort points, flag blockers, and track velocity.
- **Monitoring & Timeline:** Advanced Gantt charts and project health metrics (On Track, At Risk, Delayed).

### 4. 💼 Intern / Employee (The Workforce)
The workforce logs into a highly focused, distraction-free environment to execute their work.
- **My Tasks Dashboard:** Employees view tasks assigned to them by HR (admin tasks) or their PMO (project deliverables).
- **Execution Workflow:** 
  - Tasks start as **"Open"**.
  - Employee clicks **"Start Task"** (shifts to "In Progress").
  - Upon completion, they click **"Submit for Review"** (shifts to "Needs Review").
  - The PMO or HR then reviews the work and either requests changes or marks it "Completed".
- **Learning & Performance:** Employees can view their own performance metrics and access company learning resources.

---

## 📊 Database Schema Overview (MongoDB)

Our MongoDB implementation utilizes relational references (`populate()`) to link the ecosystem together:

- **Users Collection:** Stores credentials, Role references, Department references, and Profile data.
- **Roles & Permissions Collection:** Defines the RBAC Access Matrix dynamically.
- **Projects Collection:** Stores project metadata, health status, the assigned PMO (Owner), the assigned HR Rep, and an array of ObjectIds referencing the isolated `teamMembers`.
- **Tasks Collection:** Stores task details, priority, effort, linked `projectId`, assigned `userId`, and current status (Backlog, In Progress, Review, Completed).

---

## 🎨 Premium UI/UX Design Philosophy

OMS was built with a strict adherence to **Advanced SaaS Aesthetics**. It is designed to feel "wise", dense, and incredibly professional.
- **High-Density Layouts:** Eliminating excessive whitespace to provide data-rich dashboards suitable for enterprise management.
- **Unified Component System:** Heavy reliance on a core `PageWrapper`, custom interactive `Modal` overlays, and dynamic `StatusBadge` components.
- **Color Psychology:** 
  - Backgrounds: Crisp Slate (`#F8FAFC`) with pure white cards.
  - Typography: Midnight Blue (`#0F172A`) for intense readability.
  - Status Indicators: Emerald (`#10B981`) for Success, Amber (`#F59E0B`) for Warnings, Rose (`#EF4444`) for Critical blockers, and Royal Blue (`#2563EB`) for Primary Actions.
- **Micro-Interactions:** Custom thin scrollbars, hover-state shadows, smooth CSS transitions, and drag-and-drop mechanics ensure the platform feels alive.

---

## ⚙️ Setup & Installation Guide

**Prerequisites:** Node.js (v18+) and a running MongoDB instance (Local or Atlas).

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd OMS
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `/backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/oms
   JWT_SECRET=your_super_secret_jwt_key
   ```
   Start the server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Platform:**
   Navigate to `http://localhost:5173` in your browser. 
   *(Note: The backend seed script will automatically create an Admin account on first startup).*