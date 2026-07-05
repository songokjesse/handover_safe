# HandoverSafe 🛡️

**HandoverSafe** is a secure, mobile-first Progressive Web App (PWA) designed specifically for Supported Independent Living (SIL) environments. It streamlines shift handovers, task management, and operational accountability for support workers, team leaders, and managers.

## 🌟 The Problem We Solve
Traditional shift handovers in care environments often rely on unstructured paper notes, verbal communications, or generic messaging apps. This leads to missed tasks, privacy risks, and a lack of accountability. 

HandoverSafe provides a structured, compliant, and privacy-by-design solution that ensures incoming staff are fully briefed and outstanding tasks are reliably tracked without exposing sensitive participant data unnecessarily.

## ✨ Key Features
- **Secure Authentication & RBAC**: Role-based access control for Support Workers, Team Leaders, Managers, and Admins.
- **House & Shift Management**: Workers can only access data for houses they are actively assigned to.
- **Structured Handovers**: Mandatory checklists, medication verification, and incident reporting.
- **Task Persistence**: Outstanding or incomplete tasks automatically roll over to the next shift.
- **Data Minimization & Privacy**: Built with strict Row-Level Security (RLS) policies to ensure data is only visible to authorized personnel.
- **Audit Trails**: Comprehensive logging of actions for compliance and accountability.

## 🏗️ Technology Stack
- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router), React, TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS)
- **State Management & Validation**: React Hook Form, Zod
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Integration), [Playwright](https://playwright.dev/) (E2E)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Supabase account

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/songokjesse/handover_safe.git
   cd handover_safe
   ```

2. **Install dependencies:**
   ```bash
   cd web
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the `web/` directory with your Supabase project credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Run Database Migrations:**
   Run the SQL scripts located in `supabase/migrations/` in your Supabase SQL Editor to set up the tables, Row-Level Security (RLS) policies, and triggers.

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## 🧪 Testing
We use Vitest for unit and integration testing, and Playwright for End-to-End (E2E) testing.

To run tests (from the `web/` directory):
- **Unit/Integration**: `npm run test` (requires configuring scripts in package.json)
- **E2E**: `npx playwright test`

## 📚 Documentation
Comprehensive documentation for the project architecture, PRD, and security guidelines can be found in the root directory (e.g., `HandoverSafe_PRD_v1.md`, `HandoverSafe_Security_Compliance_Guide_v1.md`, etc.).

---
*Built for security, compliance, and reliable care.*
