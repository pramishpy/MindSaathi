# MindSaathi Schools (React + TypeScript MVP)

MindSaathi Schools is a modern React/TypeScript MVP built for hackathon use cases focused on reducing mental health stigma and improving early support in school communities.

This app provides role-based experiences for students, teachers, and admins, with personalized learning dashboards, anti-stigma course modules, embedded video learning, interactive games, and school-level analytics.

## Problem Focus

In conservative contexts, students often avoid mental health conversations because of stigma, misinformation, and fear of judgment. This MVP helps schools normalize facts-based learning and safe help-seeking behavior.

## Implemented MVP Features

### 1. Authentication and Accounts
- Signup with role selection: `student`, `teacher`, or `admin`
- Login/logout
- Session persistence using local storage

### 2. User Profile
- Edit name, school, grade, and learning interests
- View learning history (completed modules)
- Role visibility in profile

### 3. Student Dashboard (Personalized)
- Personalized module recommendations by interests and progress
- Progress KPI cards
- "Courses completed till now" section
- In-progress and next-step module guidance
- Assignment progress and pending task visibility

### 4. Courses and Learning Modules
- Course library with search and topic filtering
- Topic-specific modules on anxiety, depression, bipolar disorder, schizophrenia, stigma, and wellbeing
- Embedded YouTube videos per course
- Myth vs fact sections to challenge misinformation
- Interactive quiz game inside each module
- Actions to enroll and mark courses complete

### 5. Student Assignments
- Module-specific assignments with clear deliverables and estimated time
- Dedicated assignments page with Pending/Submitted filters
- One-tap assignment submission tracking for students
- Assignment-aware dashboard quick actions and progress indicators

### 6. Resource Hub
- Trusted support links and school-safe references
- Stigma challenge mini-game
- Additional embedded awareness video

### 7. Teacher/Admin Dashboard (Class-Level Analytics)
- Access for teacher/admin accounts
- Filters by school and grade
- Cohort metrics (enrollment, completion, average completion, low engagement)
- Top topic engagement and most completed modules
- Top learners table for selected cohort
- Suggested instructional actions for stigma reduction programs

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- Local storage for MVP persistence

## Project Structure

```text
src/
  components/
    AppShell.tsx
    ProtectedRoute.tsx
  context/
    AuthContext.tsx
  data/
    courses.ts
  lib/
    storage.ts
  pages/
    LoginPage.tsx
    SignupPage.tsx
    DashboardPage.tsx
    CoursesPage.tsx
    CourseDetailPage.tsx
    ResourcesPage.tsx
    ProfilePage.tsx
    TeacherDashboardPage.tsx
  App.tsx
  index.css
  main.tsx
  types.ts
```

## Routes

Public:
- `/login`
- `/signup`

Protected:
- `/dashboard`
- `/courses`
- `/courses/:courseId`
- `/assignments`
- `/resources`
- `/profile`
- `/teacher-dashboard` (teacher/admin analytics view)

## Local Data Model and Persistence

Local storage keys:
- `mindsaathi_users_v1`
- `mindsaathi_session_v1`

Stored user data includes:
- Basic account fields
- Role
- Interests
- Enrolled and completed course IDs
- Submitted assignment IDs

Note: This is an MVP demo data layer, not production security.

## Getting Started

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Suggested Demo Flow (Hackathon)

1. Create a `student` account and complete a few modules.
2. Submit at least one module assignment.
3. Show personalized student dashboard updates.
4. Open the assignments page and toggle Pending/Submitted views.
5. Create a `teacher` or `admin` account.
6. Open teacher dashboard and filter by school/grade to show class-level insights.
7. Demonstrate a module with:
  - YouTube embed
  - Myth-vs-fact section
  - Interactive anti-stigma game
  - Module assignment workflow

## Important Safety Note

This product is educational and not a substitute for professional diagnosis or treatment. In a real deployment, crisis and local emergency support pathways must be region-specific and validated.

## Current MVP Limitations

- No backend database yet (local storage only)
- No password hashing or enterprise auth integration
- No server-side role enforcement
- No LMS export or SIS integration yet

## Next Up (Recommended)

- Backend auth + database
- Attendance-risk alerts and intervention workflows
- Teacher-side assignment review and rubric scoring
- Teacher reports export (CSV/PDF)
- Regionalized crisis support configuration
