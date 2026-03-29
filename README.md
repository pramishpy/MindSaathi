# MindSaathi Schools

MindSaathi Schools is a role-based mental health literacy platform for schools and youth programs. It combines short learning modules, myth-vs-fact activities, assignments, support resources, and cohort analytics to help reduce stigma and strengthen early support behavior.

This is an educational product, not a clinical diagnosis or treatment tool.

## What's New (March 2026)

- Public landing page includes a full support ticket form for pilot, onboarding, technical, and licensing requests.
- In-app Support page now mirrors the stakeholder support flow with a feature overview and ticket intake.
- Dashboard quick-action badges and support feature icons use text labels instead of emoji symbols.
- Course status and quiz feedback use clear text labels (for example: "Correct", "Incorrect", "Completed", "In progress").
- Student learning flow remains role-based, while teacher/admin analytics continue to provide cohort-level visibility.

## Problem Focus

In many school contexts, students avoid mental health conversations due to stigma, misinformation, and fear of judgment. MindSaathi Schools helps institutions deliver structured, evidence-informed learning that builds empathy, improves literacy, and connects students to trusted support pathways.

## Feature Overview

### Authentication and Role-Based Access

- Signup with role selection: student, teacher, or admin
- Login/logout with session persistence
- Starter module enrollment is created automatically from selected interests
- Protected routes across dashboard, courses, assignments, resources, support, profile, and analytics

### Public Landing and Buyer Onboarding

- School-focused product narrative and KPI cards
- Platform feature cards for stakeholder review
- Embedded support ticket form directly on the landing page
- Ticket counter persisted per browser session using local storage

### Student Dashboard

- Personalized recommendations using interests and completion progress
- Completion rate metric with progress bar
- Quick-action cards for learning, challenge play, assignment progress, and profile updates
- Assignment progress panel with pending and submitted context
- Recommended modules and school action prompts

### Courses Library

- Search by title/topic keywords
- Topic filters and progress filters (all, not started, in progress, completed)
- Sorting (recommended first, shortest first, A to Z)
- Course card status treatment for enrolled/completed states

### Course Detail Experience

- Embedded learning video
- Myth-vs-fact cards with visual differentiation
- Interactive single-question quiz with explicit feedback
- Enroll and mark-as-completed controls
- Completion confirmation banner
- Assignment cards with one-tap submission state updates
- Activities and trusted external resource links

### Student Assignments

- Assignment status dashboard (pending/submitted/all)
- Assignment completion metric and status chips
- One-click submission tracking per assignment
- Student-only access guard with fallback guidance for non-student roles

### Resource Hub

- Crisis support strip with 988 Lifeline and Crisis Text Line
- Featured classroom video
- Four-step stigma challenge game with score and explanations
- Trusted external resources (NAMI, MHA, 988, Crisis Text Line)

### Support Workflows

- Available on both the public landing page and authenticated support page
- Issue types:
  - Platform demo request
  - Pricing and licensing
  - Technical onboarding
  - School pilot setup
  - Other support need
- Ticket IDs are generated client-side and stored locally
- Ticket details require a minimum detail length for better triage quality

### Teacher/Admin Analytics Dashboard

- Access restricted to teacher and admin roles
- Filters by school and grade
- Cohort metrics:
  - Total students
  - Enrolled students
  - Students with completion
  - Average completed modules
  - Stigma module completions
  - Low-engagement students
- Topic engagement and top completed course insights
- Top learner table sorted by completion outcomes

### Profile

- Edit name, school, grade, and interests
- View learning history and completed module list

## Routes

Public routes:

- / - Landing page (redirects authenticated users to /dashboard)
- /login
- /signup

Protected routes:

- /dashboard
- /courses
- /courses/:courseId
- /assignments
- /resources
- /support
- /profile
- /teacher-dashboard

## Local Data Model

Local storage keys:

- mindsaathi_users_v1
- mindsaathi_session_v1
- mindsaathi_demo_seeded_v1
- mindsaathi_support_tickets_v1

Each user profile stores id, name, email, password, role, school, grade, interests, enrolled course IDs, completed course IDs, submitted assignment IDs, and createdAt.

Note: passwords are stored in plain text for MVP/demo purposes only.

## Tech Stack

- React 19
- TypeScript 5
- Vite 8
- React Router DOM 7
- Local storage persistence (no backend in MVP)
- Custom CSS (no external UI component library)

## Project Structure

```text
src/
  components/
    AppShell.tsx             Role-aware navigation shell and user progress chip
    ProtectedRoute.tsx       Auth guard for protected routes
  context/
    AuthContext.tsx          Auth state and user/course/assignment actions
  data/
    courses.ts               Course definitions with myths, games, assignments, resources
    demoUsers.ts             Seed demo accounts
  lib/
    storage.ts               Local storage helpers and demo seeding
  pages/
    LandingPage.tsx          Public product page plus support ticket form
    LoginPage.tsx            Login form
    SignupPage.tsx           Role-based signup with interests
    DashboardPage.tsx        Personalized student dashboard
    CoursesPage.tsx          Filterable and sortable course library
    CourseDetailPage.tsx     Full module experience and assignment actions
    AssignmentsPage.tsx      Student assignment tracker
    ResourcesPage.tsx        Resource hub and stigma challenge game
    SupportPage.tsx          Authenticated support overview and ticket form
    ProfilePage.tsx          Profile editing and learning history
    TeacherDashboardPage.tsx Teacher/admin cohort analytics
  App.tsx
  index.css
  main.tsx
  types.ts
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Suggested Demo Flow

1. Open the landing page and submit a sample support ticket.
2. Create a student account and select interest areas.
3. Review dashboard recommendations and quick actions.
4. Open a course, complete quiz and module actions.
5. Submit a pending assignment from module or assignments page.
6. Create a teacher/admin account in the same school.
7. Open teacher dashboard and filter by school/grade.
8. Review topic engagement and top learner analytics.

## Safety Note

MindSaathi Schools is educational and not a substitute for professional diagnosis or treatment. Real deployments should use region-specific crisis pathways and validated institutional response policies.

## Current Limitations

- No backend database (local storage only)
- No password hashing or enterprise authentication
- No server-side role enforcement
- No LMS or SIS integration
- Support tickets are stored locally and are not transmitted

## Roadmap

- Backend auth and persistent database
- Teacher-side assignment review and rubric scoring
- Attendance-risk signals and intervention workflows
- CSV and PDF exports for analytics
- Region-specific crisis support configuration
- SSO and LMS integration
