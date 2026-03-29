# MindSaathi Schools

MindSaathi Schools is a role-based mental health literacy platform built for schools. It reduces stigma through personalized learning modules, interactive myth-vs-fact activities, anti-stigma games, and school-level engagement analytics for educators.

This is an educational tool, not a clinical product. It is designed to normalize facts-based mental health conversations and support safe help-seeking behavior in school communities.

## Problem Focus

In many school contexts, students avoid mental health conversations because of stigma, misinformation, and fear of judgment. MindSaathi Schools helps institutions deliver structured, evidence-informed learning that reduces blame, builds empathy, and connects students to trusted support pathways.

## Features

### Authentication and Accounts

- Signup with role selection: student, teacher, or admin
- Login and logout with session persistence
- Auto-enrollment in starter modules on signup based on selected interests

### Student Dashboard

- Personalized module recommendations based on interests and progress
- Completion rate metric with progress bar
- Quick-action cards for continuing learning, playing the stigma challenge, completing assignments, and updating interests
- Color-coded stat cards: enrolled modules, completed, in-progress, interest tracks, pending assignments
- Assignment progress panel with pending task visibility
- Recommended next modules based on topic interests

### Courses and Learning Modules

- Course library with search, topic filter, status filter, and sort options
- Six topic areas: anxiety, depression, bipolar disorder, schizophrenia, stigma busting, everyday wellbeing
- Visual status indicators on cards: completed (green), in-progress (teal), not started (default)
- Each module includes:
  - Embedded YouTube video
  - Myth vs fact cards with red/green visual treatment
  - Single-question interactive quiz with feedback
  - Dedicated module progress panel to enroll or mark complete
  - Completion confirmation banner
  - Student assignments with deliverables
  - Hands-on classroom activities
  - Trusted external resources

### Student Assignments

- Assignments page with pending and submitted filters
- One-tap submission tracking per assignment
- Assignment-aware dashboard quick actions

### Resource Hub

- Crisis support strip with direct links to 988 Lifeline and Crisis Text Line
- Featured classroom discussion video
- Stigma challenge game: identify stigma vs supportive facts across four statements with score tracking
- Trusted external resources: NAMI, Mental Health America, Crisis Text Line, 988 Lifeline

### Support Page

- Platform features overview for school stakeholders
- Support ticket form: submit onboarding, licensing, or technical requests
- Ticket ID generation and confirmation with local persistence
- Accessible from the main navigation when logged in

### Teacher and Admin Analytics Dashboard

- Access restricted to teacher and admin roles
- Filter by school and grade
- Six color-coded cohort metrics: total students, enrolled, students with completions, average completed modules, stigma module completions, low-engagement count
- Top topic engagement with custom progress bars and percentages
- Most completed courses with student counts
- Top learners table sorted by completions and completion rate
- Recommended instructional actions for educators

### Profile

- Edit name, school, grade, and learning interest areas
- View learning history and completed module list

## Tech Stack

- React 19
- TypeScript 5
- Vite 8
- React Router DOM 7
- Local storage for MVP persistence (no backend required)
- Custom CSS design system (no UI library)

## Project Structure

```
src/
  components/
    AppShell.tsx          Navigation shell with role-aware nav and user progress bar
    ProtectedRoute.tsx    Auth guard for protected routes
  context/
    AuthContext.tsx       Auth state, user management, enrollment and completion logic
  data/
    courses.ts            Six course definitions with myths, games, assignments, resources
    demoUsers.ts          Pre-seeded demo accounts for presenting the platform
  lib/
    storage.ts            Local storage helpers with demo user seeding on first load
  pages/
    LandingPage.tsx       Public marketing page, redirects authenticated users to dashboard
    LoginPage.tsx         Login form
    SignupPage.tsx        Signup form with interest selection and role choice
    DashboardPage.tsx     Personalized student dashboard
    CoursesPage.tsx       Filterable course library
    CourseDetailPage.tsx  Full module page: video, myths, game, assignments, completion
    AssignmentsPage.tsx   Student assignment tracker
    ResourcesPage.tsx     Crisis resources, classroom video, stigma challenge game
    SupportPage.tsx       Platform features overview and support ticket form
    ProfilePage.tsx       Profile editing and learning history
    TeacherDashboardPage.tsx  Cohort analytics for teachers and admins
  App.tsx
  index.css
  main.tsx
  types.ts
```

## Routes

Public:

- `/` - Landing page (redirects to `/dashboard` if already logged in)
- `/login`
- `/signup`

Protected (requires login):

- `/dashboard` - Student personalized dashboard
- `/courses` - Course library with filters
- `/courses/:courseId` - Full module detail page
- `/assignments` - Student assignments tracker
- `/resources` - Mental health resources and stigma challenge game
- `/support` - Platform features and support ticket form
- `/profile` - Profile editing
- `/teacher-dashboard` - Teacher and admin cohort analytics

## Local Data Model

Local storage keys:

- `mindsaathi_users_v1` - All user profiles
- `mindsaathi_session_v1` - Active session email
- `mindsaathi_demo_seeded_v1` - Flag to prevent re-seeding demo users
- `mindsaathi_support_tickets_v1` - Submitted support tickets

Each user profile stores: id, name, email, role, school, grade, interests, enrolled course IDs, completed course IDs, submitted assignment IDs, and account creation date.

Passwords are stored in plain text. This is an MVP demo data layer with no production security model.

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

## Demo Flow

1. Open the app and create a student account. Select at least one interest area during signup.
2. On the dashboard, review your personalized module recommendations and progress stats.
3. Open a course module and go through the embedded video, myth vs fact section, and interactive quiz.
4. Mark the module as completed and observe the completion banner and dashboard progress update.
5. Navigate to the assignments page and submit a pending assignment.
6. Log out and create a teacher or admin account at the same school.
7. Open the teacher dashboard and filter by school and grade to see cohort analytics.
8. Show the top learners table and topic engagement bars.
9. Navigate to the Support page to show the platform features overview and support ticket form.

## Safety Note

This product is educational and is not a substitute for professional mental health diagnosis or treatment. In a real deployment, crisis support pathways must be region-specific and validated with local health authorities.

## Current Limitations

- No backend database (local storage only)
- No password hashing or enterprise authentication
- No server-side role enforcement
- No LMS or SIS integration
- Support tickets are stored locally and not transmitted

## Roadmap

- Backend authentication and database
- Teacher-side assignment review and rubric scoring
- Attendance-risk alerts and intervention workflows
- CSV and PDF report export for teachers
- Regionalized crisis support configuration
- SSO and LMS integration
