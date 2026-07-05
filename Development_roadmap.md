# HandoverSafe Developer Roadmap (Security-First Edition)

This document serves as the step-by-step developer execution plan for building the **HandoverSafe** mobile-first shift handover and accountability platform for Supported Independent Living (SIL) houses. 

It integrates the requirements of the PRD, SRS, SAD, DDD, and **Security & Compliance Guide** directly into each sprint. Security, privacy by design, data minimisation, and row-level access control are treated as core components of every implementation step rather than post-development review items.

---

## 🛠 Project Foundations & Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend / Database**: Supabase (Auth, DB/PostgreSQL, Storage), Vercel (Hosting)
- **State & Forms**: TanStack Query (Server State), React Hook Form, Zod (Validation)
- **PWA Capabilities**: Service Worker for asset caching & offline capability, Manifest configuration
- **Testing & Tooling**: ESLint, Prettier, Vitest (Unit testing), Playwright (E2E testing), GitHub Actions (CI/CD)

---

## 🌳 Version Control & Branching Strategy

To ensure a smooth, stable, and collaborative development lifecycle for HandoverSafe, we follow a simple **GitHub Flow** with **Conventional Commits**:

1. **Branching**:
   - `main`: The single source of truth and production-ready code.
   - `feature/<feature-name>`: Branches for new features (e.g., `feature/shift-management`).
   - `fix/<bug-name>`: Branches for bug fixes (e.g., `fix/auth-middleware-crash`).
   - `chore/<task-name>`: Branches for maintenance tasks (e.g., `chore/update-dependencies`).

2. **Commit Messages (Conventional Commits)**:
   - `feat: <description>` for new features.
   - `fix: <description>` for bug fixes.
   - `chore: <description>` for maintenance and setup.
   - `docs: <description>` for documentation changes.
   - `refactor: <description>` for code restructuring.

3. **Pull Requests (PRs)**:
   - Always create a PR to merge `feature/`, `fix/`, or `chore/` branches into `main`.
   - Ensure PRs are small, focused, and reviewed before merging.

---

## 🗺 Implementation Phases & Sprints

### Phase 1: MVP Foundation (Sprints 1–5)
*Goal: A functional PWA that support workers can use on a mobile device to select a house/shift, complete a checklist, manage outstanding tasks, and submit a handover with incoming worker acknowledgement.*

#### 🏃 Sprint 1: Project Setup, Auth, Security Headers & User Management
* **Focus**: Workspace structure, database schema initialization, authentication, security headers, and secure user creation.
* **Database Actions**:
  - [ ] Initialize Supabase migrations under `supabase/migrations/`
  - [ ] Create `users` table linked to Supabase Auth:
    ```sql
    CREATE TABLE users (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name text NOT NULL,
      email text UNIQUE NOT NULL,
      role text NOT NULL CHECK (role IN ('support_worker', 'team_leader', 'manager', 'admin')),
      status text NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')),
      last_login_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    ```
  - [ ] Enable Row-Level Security (RLS) on `users`.
  - [ ] Create RLS Policy: *Users can read their own profile; admins, managers, and team leaders can read all user profiles.*
* **Frontend Actions**:
  - [ ] Initialize monorepo or standard Next.js template. Set up TypeScript (`strict` mode).
  - [ ] Configure Tailwind CSS and add color palette tokens from the UI Spec (Primary: `#2563EB`, Success: `#16A34A`, Warning: `#F59E0B`, Text: `#0F172A`).
  - [ ] Setup shadcn/ui components (`button`, `input`, `card`, `dialog`, `toast`).
  - [ ] Build Authentication screens under `app/(auth)/login` and `app/(auth)/forgot-password`.
  - [ ] Build Admin User Management page (`app/admin/users/page.tsx`) restricted to `admin` users.
  - [ ] Implement Server Action (`app/actions/users.ts`) that:
    1. Uses the Supabase Auth Admin API (`supabase.auth.admin.createUser`) to register new workers.
    2. Inserts their corresponding profile record directly into the `users` table.
  - [ ] Add route middleware (`middleware.ts`) to redirect unauthenticated users to `/login`.
* **🔒 Security & Compliance Checklist**:
  - [ ] Configure secure HTTP headers in `next.config.js` (HSTS, Content Security Policy (CSP), X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
  - [ ] Configure automatic session expiration: set Next.js middleware and Supabase Auth session settings to expire tokens after 1 hour of inactivity.
  - [ ] Enforce strong password policy constraints on user forms via Zod schemas (minimum 8 characters, mix of uppercase, lowercase, numbers, and symbols).
  - [ ] Apply input validation on Server Action fields to prevent SQL injection or cross-site scripting (XSS) payloads.
* **Verification**:
  - Verify admin user creation flow: creating a worker via the admin page successfully creates their Auth account and inserts their public profile.
  - Verify route protection (non-admins cannot access the admin page).
  - Run security header audits (e.g. check response headers via browser developer tools or securityheaders.com mock tests).

---

#### 🏃 Sprint 2: House & Shift Management
* **Focus**: Restricting access to assigned houses and self-selecting active shifts.
* **Database Actions**:
  - [ ] Create `houses` table (Data Minimisation: store suburb/region only; no exact residential street addresses):
    ```sql
    CREATE TABLE houses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      location text, -- General suburb or identifier
      status text NOT NULL CHECK (status IN ('active', 'inactive')),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    ```
  - [ ] Create `user_house_assignments` table:
    ```sql
    CREATE TABLE user_house_assignments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      house_id uuid NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
      assigned_by uuid REFERENCES users(id),
      assigned_at timestamptz NOT NULL DEFAULT now(),
      status text NOT NULL CHECK (status IN ('active', 'inactive')),
      UNIQUE(user_id, house_id)
    );
    ```
  - [ ] Create `shifts` table:
    ```sql
    CREATE TABLE shifts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      house_id uuid NOT NULL REFERENCES houses(id),
      user_id uuid NOT NULL REFERENCES users(id),
      shift_type text NOT NULL CHECK (shift_type IN ('AM', 'PM', 'Night', 'Custom')),
      start_time timestamptz NOT NULL,
      end_time timestamptz,
      status text NOT NULL CHECK (status IN ('active', 'submitted', 'cancelled')),
      submitted_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    ```
  - [ ] Enable RLS on `houses`, `user_house_assignments`, and `shifts`.
  - [ ] Add unique index and trigger to prevent duplicate active shifts (same user, house, and active status).
* **Frontend Actions**:
  - [ ] Create House Selection page (`app/houses/page.tsx`) showing houses assigned to the logged-in user.
  - [ ] Create Shift Selection sheet or page (`app/shifts/new/page.tsx`) with inputs for `shift_type` (AM, PM, Night, Custom) and shift times.
  - [ ] Build global active shift context provider or custom hook (`useActiveShift`) to persist shift ID in state.
* **🔒 Security & Compliance Checklist**:
  - [ ] Enforce RLS Policy for `houses`: *Users can only view houses if they have an active assignment in `user_house_assignments`.*
  - [ ] Enforce RLS Policy for `shifts`: *Users can only create shifts for houses they are assigned to, and can only edit their own active shifts.*
  - [ ] Add double-verification check in backend API: check that the active user's ID exists and is mapped to the target house before writing a shift record.
* **Verification**:
  - Verify that a user cannot see houses they are not assigned to.
  - Verify that creating a shift fails if another shift of the same parameters is currently active for the user.

---

#### 🏃 Sprint 3: Structured Handover Checklist
* **Focus**: Loading templates, saving responses, and enforcing validation rules.
* **Database Actions**:
  - [ ] Create `checklist_templates` table:
    ```sql
    CREATE TABLE checklist_templates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      house_id uuid REFERENCES houses(id), -- Null means global default
      shift_type text CHECK (shift_type IN ('AM', 'PM', 'Night', 'Custom')), -- Null means all shifts
      section text NOT NULL, -- e.g. 'Medication', 'Housekeeping', 'Stock'
      item_name text NOT NULL,
      description text,
      is_required boolean NOT NULL DEFAULT true,
      order_index integer NOT NULL,
      status text NOT NULL CHECK (status IN ('active', 'inactive')),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    ```
  - [ ] Create `checklist_responses` table:
    ```sql
    CREATE TABLE checklist_responses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
      checklist_template_id uuid NOT NULL REFERENCES checklist_templates(id),
      status text NOT NULL CHECK (status IN ('done', 'not_done', 'not_applicable')),
      comment text,
      completed_by uuid NOT NULL REFERENCES users(id),
      completed_at timestamptz DEFAULT now(),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT comment_required_when_not_done CHECK (status != 'not_done' OR comment IS NOT NULL)
    );
    ```
  - [ ] Enable RLS on templates and responses.
  - [ ] Populate database seed script (`supabase/seeds/01_checklist_templates.sql`) with mandatory items (Medication confirmation, health monitoring, housekeeping, personal care, and stock checks).
* **Frontend Actions**:
  - [ ] Create Checklist screen (`app/checklist/page.tsx`) with section accordions.
  - [ ] Add interactive buttons for checklist item options: Done (Green), Not Done (Red), N/A (Gray).
  - [ ] Implement conditional input text area for Not Done items (mandatory comment validation).
  - [ ] Add top-level Progress Bar showing percentage of completed responses.
  - [ ] Integrate auto-save logic: checklist inputs trigger debounce queries to Supabase API to sync in the background.
* **🔒 Security & Compliance Checklist**:
  - [ ] **Privacy Check (Data Minimisation)**: Enforce rules that checklist items record verification status only (e.g. *PRN Administered: Yes/No*). Do not store clinical diagnoses, NDIS numbers, or patient personal identifiers in comment fields.
  - [ ] Enforce RLS Policy for `checklist_responses`: *Users can write responses only if the linked shift is active, owned by the authenticated user, and matches their assigned house.*
  - [ ] Strictly validate comment inputs using Zod to sanitize HTML/Script tags, preventing XSS injection.
* **Verification**:
  - Test validation rules: confirm that submission fails if "Not Done" is selected without a comment, or if a mandatory item is skipped.
  - Confirm that Support Worker B cannot edit or insert checklist responses for a shift belonging to Support Worker A.

---

#### 🏃 Sprint 4: Task Accountability & Notifications
* **Focus**: Creating shift tasks, carrying incomplete tasks forward, and generating notifications.
* **Database Actions**:
  - [ ] Create `outstanding_tasks` table:
    ```sql
    CREATE TABLE outstanding_tasks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      house_id uuid NOT NULL REFERENCES houses(id),
      shift_id uuid REFERENCES shifts(id), -- Null if not created in a shift
      title text NOT NULL,
      description text,
      category text NOT NULL CHECK (category IN ('medication', 'appointment', 'stock', 'laundry', 'cleaning', 'other')),
      priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      status text NOT NULL CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
      due_at timestamptz,
      created_by uuid NOT NULL REFERENCES users(id),
      assigned_to uuid REFERENCES users(id),
      completed_by uuid REFERENCES users(id),
      completed_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    ```
  - [ ] Create `notifications` table:
    ```sql
    CREATE TABLE notifications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      house_id uuid REFERENCES houses(id),
      title text NOT NULL,
      message text NOT NULL,
      type text NOT NULL CHECK (type IN ('task', 'stock', 'appointment', 'medication', 'system')),
      is_read boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(),
      read_at timestamptz
    );
    ```
  - [ ] Enable RLS on both tables.
* **Frontend Actions**:
  - [ ] Create Task Management tab/page (`app/tasks/page.tsx`) showing active and completed tasks for the house.
  - [ ] Implement Task Creation modal (`+ New Task`) with title, category, priority, and optional due date.
  - [ ] Create in-app Notifications center (`app/notifications/page.tsx`) with filters and badge counts.
* **🔒 Security & Compliance Checklist**:
  - [ ] Enforce RLS Policy for `outstanding_tasks`: *Users can only view, create, or update tasks for houses they are currently assigned to in `user_house_assignments`.*
  - [ ] Enforce RLS Policy for `notifications`: *A user can read only their own notification records (`notifications.user_id = auth.uid()`).*
  - [ ] Prevent data leaks: Sanitise task titles and descriptions. Limit details to actions needed (e.g. *"Reorder gloves"*, not *"Medication instructions for Participant X"*).
* **Verification**:
  - Verify that open tasks for a house automatically carry over and display on the next worker's dashboard.
  - Verify that a user fails to query or read tasks belonging to houses they are not assigned to.

---

#### 🏃 Sprint 5: Handover Review & Acknowledgement
* **Focus**: Summary screen validation, electronic acknowledgement, and immutable audit logs.
* **Database Actions**:
  - [ ] Create `handover_acknowledgements` table:
    ```sql
    CREATE TABLE handover_acknowledgements (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
      acknowledged_by uuid NOT NULL REFERENCES users(id),
      acknowledged_at timestamptz NOT NULL DEFAULT now(),
      comment text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    ```
  - [ ] Create immutable `audit_logs` table:
    ```sql
    CREATE TABLE audit_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES users(id),
      action text NOT NULL,
      entity_type text NOT NULL,
      entity_id uuid,
      metadata jsonb,
      ip_address text,
      device_info text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    ```
  - [ ] Create a database trigger to protect audit logs:
    ```sql
    CREATE OR REPLACE FUNCTION block_audit_modifications()
    RETURNS TRIGGER AS $$
    BEGIN
      RAISE EXCEPTION 'Audit logs are immutable and cannot be updated or deleted.';
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_block_audit_modifications
    BEFORE UPDATE OR DELETE ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION block_audit_modifications();
    ```
* **Frontend Actions**:
  - [ ] Create Handover Review page (`app/handover/review/page.tsx`) consolidating completed items, outstanding tasks, and low stock warnings.
  - [ ] Build Handover Submission flow: locks the shift status to `submitted`, records `submitted_at`, and triggers an audit log event.
  - [ ] Create Incoming Acknowledgement screen (`app/handover/acknowledge/page.tsx`) that prompts incoming support workers to view the submitted summary and click "I've Read & Understood today's handover".
* **🔒 Security & Compliance Checklist**:
  - [ ] **Shift Lock Security**: Implement DB check/policy: once a shift's status is updated to `submitted`, all related `checklist_responses` must reject any update, insert, or delete actions from normal user roles.
  - [ ] **Immutable Audit Logging**: Ensure that critical actions (login, logout, shift creation, checklist updates, handover submission, task modifications, report exports) execute an insert into the `audit_logs` table.
  - [ ] Enforce RLS on `audit_logs`: *Read access is strictly restricted to `admin` and `manager` roles.*
* **Verification**:
  - Ensure that once a handover is submitted, all checklist responses for that shift become read-only.
  - Test database trigger: confirm that executing an `UPDATE` or `DELETE` statement on `audit_logs` results in a database exception.

---

### Phase 2: Pilot & Dashboard (Sprints 6–7)
*Goal: Reporting dashboard for managers, automated summary exports, PWA offline configurations, and deployment.*

#### 🏃 Sprint 6: Manager Dashboard & Reports
* **Focus**: Compliance statistics, data views, and PDF/CSV exports.
* **Database Actions**:
  - [ ] Create database views for reporting:
    - `view_daily_house_summary`
    - `view_open_tasks_by_house`
    - `view_missed_required_items`
* **Frontend Actions**:
  - [ ] Build Manager Dashboard view (`app/dashboard/page.tsx`) with summary tiles (Open Tasks, House Compliance Rate, Recent Incidents, Low Stock).
  - [ ] Add simple data visualizations using `recharts` (Task Completion Rate, Handover Submission stats).
  - [ ] Build Reports export tab (`app/reports/page.tsx`) allowing users to download CSV and basic PDF summaries of shifts.
* **🔒 Security & Compliance Checklist**:
  - [ ] **RBAC Enforcement**: Implement middleware/route guards to block dashboard and reports routes for users with the `support_worker` role.
  - [ ] **Secure Log Export**: Log every export query in the `audit_logs` table including the user ID, timestamp, house ID, and parameters of the exported data.
  - [ ] **Data Sanitisation on Export**: Ensure exported PDFs/CSVs do not package structural system data or private profiles of users.
* **Verification**:
  - Verify that a `support_worker` account attempting to access `/dashboard` or `/reports` is redirected to the home dashboard or receives a 403 Forbidden page.
  - Export CSV and verify data accuracy against database rows.

---

#### 🏃 Sprint 7: PWA, Security Auditing, Free Tier Limits & Deployment
* **Focus**: Offline service worker cache, security policy validation, and production builds under Free Tier limits.
* **Frontend & Backend Actions**:
  - [ ] Set up `next-pwa` or custom Service Worker to cache layout assets and database templates.
  - [ ] Configure `manifest.json` with icons, background color, and standalone display mode.
  - [ ] Set up offline warning banner and UI states (greyed out actions when disconnected).
  - [ ] Audit RLS policies using Supabase CLI test scripts.
  - [ ] Configure deployment pipelines in Vercel and GitHub Actions.
* **🔒 Security & Compliance Checklist**:
  - [ ] **Offline Data Security**: The PWA service worker and browser cache (CacheStorage/IndexedDB) must not persist clinical notes, participant profiles, or audit logs. Local data cache must be explicitly cleared on user logout.
  - [ ] **Dependency Scanning**: Add automated security checks (such as `npm audit` or Snyk) to the CI/CD pull request flow to detect and patch vulnerable packages.
  - [ ] **Environment Separation**: Maintain distinct credentials, databases, and variables for Development, Staging, and Production. No environment configurations or secrets may be checked into Git.
* **⚡ Free Tier Constraints Checklist**:
  - [ ] Enforce max size limits on files uploaded to Supabase Storage (e.g. max 1MB for verification documents).
  - [ ] Set up database retention function to archive/prune old notifications and inactive temp data (keeps database under the 500MB free limit).
  - [ ] Ensure edge functions / server functions do not run unnecessary cron polls to avoid Vercel Serverless execution limits.
* **Verification**:
  - Test service worker caching: load the app, turn on browser offline mode, reload the page, and ensure the app loads. Verify that logging out wipes all local caches.
  - Run RLS audit tests using `supabase policy` commands in local development.

---

## 🔒 Definition of Done (DoD)

A developer task or feature branch is complete only when:
1. **Functional Acceptance**: All acceptance criteria outlined in the SRS/PRD are met.
2. **Code Standards**: Strictly typed with TypeScript, passing ESLint checks, formatted with Prettier.
3. **Security Check**: Row-Level Security policies are active for new tables. Inputs are validated on the backend/database constraints.
4. **Testing**: Unit tests pass (Vitest). Critical user flows verified by E2E test cases (Playwright).
5. **Mobile Responsiveness**: Checked across standard mobile (375x812px) and tablet (768x1024px) viewport dimensions.
6. **Audit Trail**: Action triggers correct immutable row creation in the `audit_logs` table.
7. **Documentation**: Any DB schema changes or env changes are documented in `README.md` / `migrations` comments.
