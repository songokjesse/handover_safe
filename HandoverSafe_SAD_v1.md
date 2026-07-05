# HandoverSafe System Architecture Document (SAD)

**Version:** 1.0\
**Author:** Jesse Songok\
**Date:** July 2026\
**System:** HandoverSafe\
**Document Type:** System Architecture Document

------------------------------------------------------------------------

# 1. Purpose

This System Architecture Document describes the proposed technical
architecture for **HandoverSafe**, a mobile-first Progressive Web
Application (PWA) for Supported Independent Living (SIL) handovers, task
verification, and operational accountability.

The document explains how the system is structured, how components
interact, how data flows, and how privacy, security, scalability, and
reliability will be maintained.

------------------------------------------------------------------------

# 2. Architecture Goals

The architecture must support:

-   Mobile-first usage by frontline support workers
-   Fast shift handover completion
-   Secure handling of sensitive care-related information
-   Role-based access control
-   Auditability
-   Offline capability
-   Low-cost MVP deployment
-   Future AI and integration capabilities

------------------------------------------------------------------------

# 3. Architecture Style

HandoverSafe will use a modern cloud-based web architecture.

## Recommended MVP Architecture

-   **Frontend:** Next.js Progressive Web App
-   **Backend:** Supabase Backend-as-a-Service
-   **Database:** PostgreSQL
-   **Authentication:** Supabase Auth
-   **Storage:** Supabase Storage
-   **Hosting:** Vercel
-   **Security:** Row-Level Security, HTTPS, audit logging

------------------------------------------------------------------------

# 4. High-Level System Overview

``` text
Mobile Browser / PWA
        |
        v
Next.js Frontend on Vercel
        |
        v
Supabase API Layer
        |
        v
PostgreSQL Database
        |
        v
Audit Logs / Reports / Notifications
```

------------------------------------------------------------------------

# 5. C4 Model

## 5.1 Context Diagram

``` text
+-------------------+
| Support Worker    |
+-------------------+
          |
          v
+-------------------+        +-------------------+
| HandoverSafe App  | <----> | Supabase Backend |
+-------------------+        +-------------------+
          |
          v
+-------------------+
| Manager Dashboard |
+-------------------+
```

External future systems may include:

-   Rostering systems
-   Medication management systems
-   Calendar systems
-   Email and SMS services
-   Microsoft Teams

------------------------------------------------------------------------

## 5.2 Container Diagram

``` text
+-----------------------------+
| Next.js PWA                 |
| - Mobile UI                 |
| - Checklist screens         |
| - Handover screens          |
| - Manager dashboard         |
+-------------+---------------+
              |
              v
+-----------------------------+
| Supabase Services           |
| - Authentication            |
| - API                       |
| - Realtime                  |
| - Storage                   |
+-------------+---------------+
              |
              v
+-----------------------------+
| PostgreSQL Database         |
| - Users                     |
| - Houses                    |
| - Shifts                    |
| - Checklist items           |
| - Outstanding tasks         |
| - Audit logs                |
+-----------------------------+
```

------------------------------------------------------------------------

# 6. Main Components

## 6.1 Mobile PWA Frontend

The frontend provides the user interface for staff and managers.

Key responsibilities:

-   Login and session management
-   House selection
-   Shift selection
-   Checklist completion
-   Outstanding task creation
-   Handover submission
-   Incoming staff acknowledgement
-   Manager dashboard
-   Reports and analytics

Recommended technologies:

-   Next.js
-   React
-   Tailwind CSS
-   shadcn/ui
-   PWA service worker

------------------------------------------------------------------------

## 6.2 Authentication Service

Authentication will be handled by Supabase Auth.

Supported features:

-   Email/password login
-   Password reset
-   Optional MFA
-   Session expiry
-   Role mapping
-   Secure token-based authentication

------------------------------------------------------------------------

## 6.3 Database Layer

PostgreSQL will be the core system of record.

Primary entities:

-   Users
-   Houses
-   User house assignments
-   Shifts
-   Checklist templates
-   Checklist responses
-   Outstanding tasks
-   Notifications
-   Audit logs

------------------------------------------------------------------------

## 6.4 API Layer

Supabase provides API access to the PostgreSQL database.

The frontend will interact with the API for:

-   Creating shifts
-   Updating checklist items
-   Submitting handovers
-   Creating tasks
-   Fetching dashboards
-   Exporting reports

------------------------------------------------------------------------

## 6.5 Notification Service

MVP notifications may use:

-   In-app notifications
-   Email notifications

Future versions may include:

-   Push notifications
-   SMS
-   Microsoft Teams alerts

------------------------------------------------------------------------

## 6.6 Reporting Module

The reporting module provides:

-   Daily handover reports
-   Weekly reports
-   Monthly reports
-   Outstanding task reports
-   House performance reports
-   Staff activity reports

Reports may be exported as:

-   PDF
-   CSV

------------------------------------------------------------------------

## 6.7 Audit Logging Module

The audit module records key system actions.

Logged events include:

-   Login
-   Logout
-   Shift started
-   Checklist item updated
-   Task created
-   Task completed
-   Handover submitted
-   Handover acknowledged
-   Manager review

Audit records must be immutable.

------------------------------------------------------------------------

# 7. Data Flow

## 7.1 Shift Start Flow

``` text
User logs in
  ↓
System verifies role and assigned houses
  ↓
User selects house
  ↓
User selects shift type and time
  ↓
System checks duplicate active shift
  ↓
Shift record is created
```

------------------------------------------------------------------------

## 7.2 Checklist Completion Flow

``` text
User opens checklist
  ↓
System loads house-specific checklist template
  ↓
User marks each item as Done / Not Done / N/A
  ↓
If Not Done, reason is required
  ↓
Checklist response is saved
  ↓
Audit log is created
```

------------------------------------------------------------------------

## 7.3 Handover Submission Flow

``` text
User reviews checklist
  ↓
System checks mandatory items
  ↓
System displays outstanding tasks
  ↓
User submits handover
  ↓
Handover record is locked
  ↓
Audit log is created
```

------------------------------------------------------------------------

## 7.4 Incoming Staff Acknowledgement Flow

``` text
Incoming staff logs in
  ↓
Selects house and shift
  ↓
System displays previous handover
  ↓
Staff acknowledges handover
  ↓
Timestamp is recorded
  ↓
Audit log is created
```

------------------------------------------------------------------------

# 8. Database Architecture

## 8.1 Core Tables

### users

Stores application users.

Fields:

-   id
-   full_name
-   email
-   role
-   status
-   created_at
-   updated_at

### houses

Stores SIL house details.

Fields:

-   id
-   name
-   location
-   status
-   created_at
-   updated_at

### user_house_assignments

Controls which staff can access which houses.

Fields:

-   id
-   user_id
-   house_id
-   assigned_at

### shifts

Stores staff-selected shifts.

Fields:

-   id
-   user_id
-   house_id
-   shift_type
-   start_time
-   end_time
-   status
-   submitted_at

### checklist_templates

Stores reusable checklist templates.

Fields:

-   id
-   house_id
-   section
-   item_name
-   is_required
-   order_index

### checklist_responses

Stores staff responses.

Fields:

-   id
-   shift_id
-   template_item_id
-   status
-   comment
-   updated_by
-   updated_at

### outstanding_tasks

Stores tasks carried between shifts.

Fields:

-   id
-   house_id
-   shift_id
-   title
-   description
-   priority
-   status
-   due_at
-   created_by
-   completed_by
-   completed_at

### handover_acknowledgements

Stores incoming staff acknowledgement.

Fields:

-   id
-   handover_shift_id
-   acknowledged_by
-   acknowledged_at

### notifications

Stores user notifications.

Fields:

-   id
-   user_id
-   title
-   message
-   type
-   is_read
-   created_at

### audit_logs

Stores immutable event logs.

Fields:

-   id
-   user_id
-   action
-   entity_type
-   entity_id
-   metadata
-   ip_address
-   device_info
-   created_at

------------------------------------------------------------------------

# 9. Security Architecture

## 9.1 Authentication

All users must authenticate before accessing the system.

Security controls:

-   Secure password policy
-   Password reset flow
-   Optional MFA
-   Session expiry
-   Token-based access

------------------------------------------------------------------------

## 9.2 Authorisation

Role-Based Access Control will define permissions.

Example:

  Role             Permissions
  ---------------- --------------------------------------------------
  Support Worker   Complete shift checklist and view assigned house
  Team Leader      Review handovers and manage tasks
  Manager          View dashboards and reports
  Administrator    Manage users, houses, and settings

------------------------------------------------------------------------

## 9.3 Row-Level Security

Supabase Row-Level Security policies should ensure:

-   Staff only access assigned houses
-   Staff only edit their own active shifts
-   Managers only view houses under their supervision
-   Audit logs cannot be edited or deleted

------------------------------------------------------------------------

## 9.4 Data Encryption

Required:

-   HTTPS/TLS for data in transit
-   Database encryption at rest
-   Encrypted backups
-   Secure secret management

------------------------------------------------------------------------

## 9.5 Auditability

The system must keep a full record of important actions.

Audit logs must:

-   Be append-only
-   Include timestamps
-   Include user identity
-   Include entity affected
-   Be available for authorised review

------------------------------------------------------------------------

# 10. Privacy Architecture

The system should follow privacy-by-design principles.

## 10.1 Data Minimisation

The MVP should avoid storing unnecessary clinical details.

Examples:

Instead of full participant names, use:

-   Participant initials
-   Room reference
-   Internal participant ID

Medication should be treated as verification only:

> "Medication administered according to organisation procedure: Yes / No
> / N/A"

The system should not replace the organisation's official medication
administration record.

------------------------------------------------------------------------

## 10.2 Device Privacy

The PWA should avoid permanent participant data storage on staff
devices.

Controls:

-   Short-lived cache
-   Logout clears local data
-   Offline data encrypted where possible
-   No sensitive data in browser localStorage unless encrypted

------------------------------------------------------------------------

## 10.3 Access Review

Managers should regularly review:

-   User access
-   House assignments
-   Inactive users
-   Role changes

------------------------------------------------------------------------

# 11. Offline Architecture

Offline mode is important for SIL houses with poor connectivity.

## MVP Offline Support

-   Allow checklist completion offline
-   Store draft responses locally
-   Sync when connection returns
-   Warn user when offline
-   Prevent duplicate submissions

## Conflict Handling

If two users submit conflicting records:

-   Keep both records
-   Flag for Team Leader review
-   Preserve audit trail

------------------------------------------------------------------------

# 12. Deployment Architecture

## MVP Deployment

``` text
User Device
   |
   v
Vercel CDN / Edge Network
   |
   v
Next.js Application
   |
   v
Supabase Cloud
   |
   v
PostgreSQL Database
```

------------------------------------------------------------------------

## Environments

Recommended environments:

-   Development
-   Staging
-   Production

Each environment should have separate:

-   Database
-   Authentication configuration
-   Storage bucket
-   API keys

------------------------------------------------------------------------

# 13. Scalability

The architecture should support:

-   Multiple providers
-   Multiple SIL houses
-   Hundreds of users
-   Thousands of handovers
-   Large audit logs

Scaling options:

-   Database indexing
-   Read replicas
-   Archiving old audit logs
-   Background jobs for reports
-   CDN caching for static assets

------------------------------------------------------------------------

# 14. Reliability

Reliability requirements:

-   Automatic backups
-   Point-in-time recovery
-   Monitoring
-   Error tracking
-   Uptime alerts
-   Graceful offline handling

Recommended tools:

-   Supabase backups
-   Vercel monitoring
-   Sentry
-   Log drains

------------------------------------------------------------------------

# 15. Integration Architecture

## MVP

No mandatory external integrations.

## Future Integrations

Potential integrations:

-   Rostering software via read-only API
-   Medication management systems
-   Google Calendar or Microsoft Outlook
-   Email services
-   SMS providers
-   Microsoft Teams
-   AI services

Integration principle:

> HandoverSafe should complement existing systems, not force providers
> to replace them.

------------------------------------------------------------------------

# 16. AI Architecture - Future

Future AI features may include:

-   Checklist vs progress note comparison
-   Missing task detection
-   Handover summarisation
-   Trend analysis
-   Repeated issue detection

AI safeguards:

-   Human review required
-   AI suggestions clearly labelled
-   No automatic clinical decisions
-   No replacement of medication records
-   Audit AI-generated outputs

------------------------------------------------------------------------

# 17. Monitoring and Logging

System monitoring should include:

-   Login failures
-   API errors
-   Failed submissions
-   Sync failures
-   Slow queries
-   High-risk actions
-   Notification failures

------------------------------------------------------------------------

# 18. Backup and Recovery

Backup requirements:

-   Daily backups
-   Point-in-time recovery
-   Secure backup storage
-   Regular restore testing

Recovery objectives:

-   Recovery Time Objective: 4 hours
-   Recovery Point Objective: 24 hours for MVP

------------------------------------------------------------------------

# 19. Key Architecture Decisions

  -----------------------------------------------------------------------
  Decision                Choice                  Reason
  ----------------------- ----------------------- -----------------------
  App type                PWA                     Fast, mobile-first, no
                                                  app store delay

  Backend                 Supabase                Rapid MVP development

  Database                PostgreSQL              Reliable structured
                                                  data

  Hosting                 Vercel                  Optimised for Next.js

  Auth                    Supabase Auth           Integrated with
                                                  database security

  Access control          RLS                     Strong tenant and
                                                  house-level protection

  Medication handling     Verification only       Reduces clinical and
                                                  regulatory risk
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 20. Risks and Mitigations

  Risk                      Mitigation
  ------------------------- ------------------------------------
  Staff forget to use app   Keep workflow under 3 minutes
  Duplicate shifts          Duplicate shift warning
  Privacy breach            RBAC, RLS, minimal data collection
  Poor internet             Offline mode
  Medication confusion      Verification-only wording
  Data loss                 Backups and audit logs
  Low adoption              Mobile-first simple interface

------------------------------------------------------------------------

# 21. Architecture Roadmap

## MVP

-   PWA
-   Supabase Auth
-   House selection
-   Shift selection
-   Checklist
-   Outstanding tasks
-   Acknowledgement
-   Audit logs

## Version 2

-   Offline sync
-   Push notifications
-   Reports
-   Stock alerts
-   Manager analytics

## Version 3

-   AI handover assistant
-   Read-only rostering integration
-   Calendar integration
-   SMS/email notifications
-   Multi-organisation support

------------------------------------------------------------------------

# 22. Conclusion

The proposed HandoverSafe architecture supports a secure, mobile-first,
privacy-conscious application for SIL handovers.

The system is intentionally lightweight for MVP delivery while remaining
flexible enough to support future reporting, integrations, offline
usage, and AI-powered handover validation.

Its architecture is designed to solve a practical frontline problem
without creating unnecessary rostering, clinical, or administrative
complexity.
