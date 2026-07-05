# HandoverSafe Software Requirements Specification (SRS)

**Version:** 1.0\
**Author:** Jesse Songok\
**Date:** July 2026

------------------------------------------------------------------------

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional
and non-functional requirements for **HandoverSafe**, a mobile-first
application that standardises shift handovers in Supported Independent
Living (SIL) homes.

The application is designed to reduce communication failures, improve
accountability, and ensure critical operational tasks are completed
before shifts change.

## 1.2 Scope

HandoverSafe is **not** intended to replace:

-   Progress notes
-   Medication administration records (MAR)
-   Electronic health records
-   Rostering systems

Instead, it complements existing systems by providing structured
handover verification and task continuity.

------------------------------------------------------------------------

# 2. System Overview

Primary functions:

-   Staff authentication
-   House selection
-   Shift selection
-   Structured handover checklist
-   Outstanding task management
-   Incoming staff acknowledgement
-   Notifications
-   Reporting
-   Audit logging

------------------------------------------------------------------------

# 3. User Roles

## Support Worker

-   Start a shift
-   Complete checklist
-   Create outstanding tasks
-   Submit handover
-   View current house handover

## Team Leader

-   Review handovers
-   Manage outstanding tasks
-   View reports
-   Override checklist items where authorised

## Manager

-   View organisation dashboards
-   Monitor compliance
-   Export reports
-   Configure houses

## Administrator

-   User management
-   House management
-   Role management
-   System configuration

------------------------------------------------------------------------

# 4. Functional Requirements

## FR-001 Authentication

The system shall:

-   Authenticate users using secure login.
-   Support password reset.
-   Support optional MFA.
-   Automatically log users out after inactivity.

------------------------------------------------------------------------

## FR-002 House Selection

The system shall:

-   Allow users to select an assigned house.
-   Prevent access to unauthorised houses.
-   Remember the previous house for convenience.

------------------------------------------------------------------------

## FR-003 Shift Selection

The system shall allow users to:

-   Select AM, PM, Night or Custom shift.
-   Enter start and finish times.
-   Detect duplicate active shifts.
-   Suggest shifts based on current time.

------------------------------------------------------------------------

## FR-004 Checklist

Checklist sections shall include:

-   Medication verification
-   Health monitoring
-   Personal care
-   Meals
-   Housekeeping
-   Stock checks
-   Community access
-   Incidents
-   Outstanding tasks

Each item shall support:

-   Done
-   Not Done
-   Not Applicable

If "Not Done" is selected, a reason is mandatory.

------------------------------------------------------------------------

## FR-005 Outstanding Tasks

The system shall:

-   Create follow-up tasks.
-   Assign priority.
-   Track completion.
-   Carry incomplete tasks to the next shift.

------------------------------------------------------------------------

## FR-006 Handover Submission

Before submission:

-   Mandatory checklist items must be completed.
-   Outstanding tasks displayed.
-   User confirms submission.

------------------------------------------------------------------------

## FR-007 Incoming Acknowledgement

Incoming staff shall:

-   Read previous handover.
-   Acknowledge receipt.
-   Record timestamp.

------------------------------------------------------------------------

## FR-008 Notifications

Support:

-   Push notifications
-   In-app notifications

Notification triggers:

-   Outstanding tasks
-   Low stock
-   Upcoming appointments
-   Missing checklist items

------------------------------------------------------------------------

## FR-009 Reports

Generate:

-   Daily reports
-   Weekly reports
-   Monthly reports
-   House reports
-   Worker reports
-   Compliance reports

Exports:

-   PDF
-   CSV

------------------------------------------------------------------------

## FR-010 Audit Logs

Record:

-   Login
-   Logout
-   Checklist edits
-   Task creation
-   Task completion
-   Handover submission
-   Acknowledgements

Audit logs cannot be modified.

------------------------------------------------------------------------

# 5. Non-Functional Requirements

## Performance

-   Initial page load \<2 seconds.
-   Checklist submission \<1 second.
-   Support at least 500 concurrent users.

## Availability

-   99.9% uptime target.

## Security

-   HTTPS only.
-   Encryption at rest.
-   Encryption in transit.
-   Role-based access control.
-   Row-Level Security (RLS).
-   Secure password hashing.

## Privacy

-   Collect minimum participant information.
-   No permanent storage on devices.
-   Configurable data retention.
-   Audit access to sensitive records.

## Reliability

-   Offline capability.
-   Automatic synchronisation.
-   Conflict resolution for duplicate submissions.

------------------------------------------------------------------------

# 6. Data Model (High Level)

## User

-   id
-   name
-   email
-   role

## House

-   id
-   name
-   location
-   status

## Shift

-   id
-   user_id
-   house_id
-   type
-   start_time
-   end_time

## Checklist

-   id
-   shift_id
-   section
-   item
-   status
-   comment

## OutstandingTask

-   id
-   house_id
-   created_by
-   assigned_to
-   priority
-   due_date
-   completed

## Notification

-   id
-   recipient
-   message
-   type
-   read

------------------------------------------------------------------------

# 7. Business Rules

-   Users may only access authorised houses.
-   One active shift per user.
-   Mandatory checklist completion before handover.
-   Not Done requires explanation.
-   Incoming acknowledgement required before new checklist editing.
-   Completed audit logs are immutable.

------------------------------------------------------------------------

# 8. External Interfaces

## Client

-   Progressive Web App
-   Responsive mobile interface

## Backend

-   REST API (or Supabase APIs)

## Authentication

-   Supabase Auth

## Storage

-   Supabase Storage

------------------------------------------------------------------------

# 9. Technology Stack

Frontend: - Next.js - React - Tailwind CSS - shadcn/ui

Backend: - Supabase - PostgreSQL

Hosting: - Vercel - Supabase Cloud

------------------------------------------------------------------------

# 10. Future Enhancements

-   AI checklist validation
-   Voice-to-text handovers
-   Barcode scanning for stock
-   QR code house check-in
-   Calendar integration
-   Read-only roster integration
-   Predictive analytics
-   Wearable notifications

------------------------------------------------------------------------

# 11. Acceptance Criteria

The MVP is accepted when:

-   Staff can authenticate.
-   Staff can select a house and shift.
-   Staff can complete and submit a checklist.
-   Outstanding tasks carry to the next shift.
-   Incoming staff acknowledge handover.
-   Managers can view reports.
-   Audit logs are generated automatically.
-   The application functions on Android, iPhone and tablet browsers as
    a PWA.
