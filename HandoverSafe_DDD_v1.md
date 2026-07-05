# HandoverSafe Database Design Document (DDD)

**Version:** 1.0\
**Author:** Jesse Songok\
**Date:** July 2026\
**System:** HandoverSafe\
**Document Type:** Database Design Document

------------------------------------------------------------------------

# 1. Purpose

This Database Design Document describes the proposed database structure
for **HandoverSafe**, a mobile-first handover and task accountability
application for Supported Independent Living (SIL) homes.

The database is designed to support:

-   Staff authentication and role-based access
-   House and shift management
-   Structured handover checklists
-   Outstanding task tracking
-   Incoming staff acknowledgement
-   Notifications
-   Reports
-   Audit logging
-   Privacy and security controls

------------------------------------------------------------------------

# 2. Database Technology

Recommended database:

-   **PostgreSQL**
-   Hosted using **Supabase**
-   Row-Level Security enabled
-   Point-in-time recovery enabled for production
-   Daily backups enabled

------------------------------------------------------------------------

# 3. Design Principles

The database should follow these principles:

-   Privacy by design
-   Minimum necessary participant information
-   Role-based access
-   House-level data isolation
-   Strong auditability
-   Immutable audit logs
-   Support for future multi-organisation use
-   Support for offline sync
-   Scalable reporting

------------------------------------------------------------------------

# 4. Entity Relationship Overview

``` text
organisations
   |
   |--- houses
   |       |
   |       |--- shifts
   |       |       |
   |       |       |--- checklist_responses
   |       |       |--- handover_acknowledgements
   |       |
   |       |--- outstanding_tasks
   |       |--- stock_items
   |
   |--- users
   |       |
   |       |--- user_house_assignments
   |
   |--- checklist_templates
   |--- notifications
   |--- audit_logs
```

------------------------------------------------------------------------

# 5. Core Tables

------------------------------------------------------------------------

# 5.1 organisations

Stores organisation/provider details.

## Fields

  Field        Type          Required   Description
  ------------ ------------- ---------- ----------------------------
  id           uuid          Yes        Primary key
  name         text          Yes        Organisation name
  abn          text          No         Australian Business Number
  status       text          Yes        active / inactive
  created_at   timestamptz   Yes        Record created date
  updated_at   timestamptz   Yes        Record updated date

## Notes

This table allows future multi-provider support.

------------------------------------------------------------------------

# 5.2 users

Stores application users.

## Fields

  Field             Type          Required   Description
  ----------------- ------------- ---------- ------------------------------------------------
  id                uuid          Yes        Primary key, linked to auth user
  organisation_id   uuid          Yes        Linked organisation
  full_name         text          Yes        User full name
  email             text          Yes        User email
  role              text          Yes        support_worker / team_leader / manager / admin
  status            text          Yes        active / inactive / suspended
  last_login_at     timestamptz   No         Last login timestamp
  created_at        timestamptz   Yes        Created date
  updated_at        timestamptz   Yes        Updated date

## Constraints

-   Email must be unique.
-   Role must match approved role values.

------------------------------------------------------------------------

# 5.3 houses

Stores SIL house records.

## Fields

  Field             Type          Required   Description
  ----------------- ------------- ---------- ----------------------------
  id                uuid          Yes        Primary key
  organisation_id   uuid          Yes        Linked organisation
  name              text          Yes        House name
  location          text          No         General location or suburb
  status            text          Yes        active / inactive
  created_at        timestamptz   Yes        Created date
  updated_at        timestamptz   Yes        Updated date

## Privacy Note

Avoid storing exact residential addresses unless required. A house label
or suburb is usually sufficient for MVP.

------------------------------------------------------------------------

# 5.4 user_house_assignments

Controls which users can access which houses.

## Fields

  Field         Type          Required   Description
  ------------- ------------- ---------- -----------------------------------
  id            uuid          Yes        Primary key
  user_id       uuid          Yes        Linked user
  house_id      uuid          Yes        Linked house
  assigned_by   uuid          No         Manager/admin who assigned access
  assigned_at   timestamptz   Yes        Assignment date
  status        text          Yes        active / inactive

## Constraints

-   A user should not have duplicate active assignment to the same
    house.

------------------------------------------------------------------------

# 5.5 shifts

Stores self-selected staff shifts.

## Fields

  Field             Type          Required   Description
  ----------------- ------------- ---------- --------------------------------
  id                uuid          Yes        Primary key
  organisation_id   uuid          Yes        Linked organisation
  house_id          uuid          Yes        Linked house
  user_id           uuid          Yes        Staff member who started shift
  shift_type        text          Yes        AM / PM / Night / Custom
  start_time        timestamptz   Yes        Shift start time
  end_time          timestamptz   No         Shift end time
  status            text          Yes        active / submitted / cancelled
  submitted_at      timestamptz   No         Handover submission time
  created_at        timestamptz   Yes        Created date
  updated_at        timestamptz   Yes        Updated date

## Business Rules

-   One active shift per user at a time.
-   Duplicate shift warning if same house and shift type already active.
-   Submitted shifts should be locked from normal editing.

------------------------------------------------------------------------

# 5.6 checklist_templates

Stores checklist items that apply to houses or shift types.

## Fields

  Field             Type          Required   Description
  ----------------- ------------- ---------- ---------------------------------------
  id                uuid          Yes        Primary key
  organisation_id   uuid          Yes        Linked organisation
  house_id          uuid          No         Null means organisation-wide template
  shift_type        text          No         AM / PM / Night / Custom
  section           text          Yes        Medication, Housekeeping, Stock, etc.
  item_name         text          Yes        Checklist item
  description       text          No         Optional guidance
  is_required       boolean       Yes        Whether item must be completed
  order_index       integer       Yes        Display order
  status            text          Yes        active / inactive
  created_at        timestamptz   Yes        Created date
  updated_at        timestamptz   Yes        Updated date

## Example Sections

-   Medication
-   Health monitoring
-   Appointments
-   Personal care
-   Meals
-   Housekeeping
-   Stock
-   Community access
-   Incidents
-   Outstanding tasks

------------------------------------------------------------------------

# 5.7 checklist_responses

Stores staff responses to checklist items.

## Fields

  Field                   Type          Required   Description
  ----------------------- ------------- ---------- ----------------------------------
  id                      uuid          Yes        Primary key
  shift_id                uuid          Yes        Linked shift
  checklist_template_id   uuid          Yes        Linked checklist item
  status                  text          Yes        done / not_done / not_applicable
  comment                 text          No         Required when status is not_done
  completed_by            uuid          Yes        User who completed item
  completed_at            timestamptz   No         Completion timestamp
  created_at              timestamptz   Yes        Created date
  updated_at              timestamptz   Yes        Updated date

## Business Rules

-   If status is `not_done`, comment is mandatory.
-   Required checklist items must have a response before handover
    submission.

------------------------------------------------------------------------

# 5.8 outstanding_tasks

Stores tasks carried across shifts.

## Fields

  -----------------------------------------------------------------------
  Field             Type              Required          Description
  ----------------- ----------------- ----------------- -----------------
  id                uuid              Yes               Primary key

  organisation_id   uuid              Yes               Linked
                                                        organisation

  house_id          uuid              Yes               Linked house

  shift_id          uuid              No                Shift where task
                                                        was created

  title             text              Yes               Short task title

  description       text              No                Task details

  category          text              Yes               medication /
                                                        appointment /
                                                        stock / laundry /
                                                        cleaning / other

  priority          text              Yes               low / medium /
                                                        high / urgent

  status            text              Yes               open /
                                                        in_progress /
                                                        completed /
                                                        cancelled

  due_at            timestamptz       No                Due date/time

  created_by        uuid              Yes               User who created
                                                        task

  assigned_to       uuid              No                User assigned

  completed_by      uuid              No                User who
                                                        completed task

  completed_at      timestamptz       No                Completion time

  created_at        timestamptz       Yes               Created date

  updated_at        timestamptz       Yes               Updated date
  -----------------------------------------------------------------------

## Business Rules

-   Open tasks appear in next shift handover.
-   Completed tasks remain visible in reports and audit history.
-   Urgent tasks trigger notifications.

------------------------------------------------------------------------

# 5.9 handover_acknowledgements

Stores confirmation that incoming staff read the handover.

## Fields

  Field             Type          Required   Description
  ----------------- ------------- ---------- ------------------------------------
  id                uuid          Yes        Primary key
  shift_id          uuid          Yes        Submitted shift being acknowledged
  acknowledged_by   uuid          Yes        Incoming staff user
  acknowledged_at   timestamptz   Yes        Acknowledgement time
  comment           text          No         Optional note
  created_at        timestamptz   Yes        Created date

## Business Rules

-   Acknowledgement must be linked to a submitted handover.
-   A user cannot acknowledge the same handover twice.

------------------------------------------------------------------------

# 5.10 notifications

Stores in-app notification records.

## Fields

  Field             Type          Required   Description
  ----------------- ------------- ---------- --------------------------------------------------
  id                uuid          Yes        Primary key
  organisation_id   uuid          Yes        Linked organisation
  user_id           uuid          Yes        Recipient
  house_id          uuid          No         Related house
  title             text          Yes        Notification title
  message           text          Yes        Notification body
  type              text          Yes        task / stock / appointment / medication / system
  is_read           boolean       Yes        Read status
  created_at        timestamptz   Yes        Created date
  read_at           timestamptz   No         Read timestamp

------------------------------------------------------------------------

# 5.11 stock_items

Stores stock items for each house.

## Fields

  ----------------------------------------------------------------------------
  Field               Type              Required          Description
  ------------------- ----------------- ----------------- --------------------
  id                  uuid              Yes               Primary key

  organisation_id     uuid              Yes               Linked organisation

  house_id            uuid              Yes               Linked house

  name                text              Yes               Item name

  category            text              Yes               PPE / personal_care
                                                          / continence /
                                                          cleaning /
                                                          medication_related

  current_level       text              No                high / medium / low
                                                          / out_of_stock

  reorder_threshold   text              No                Minimum acceptable
                                                          level

  status              text              Yes               active / inactive

  last_checked_by     uuid              No                User who last
                                                          checked

  last_checked_at     timestamptz       No                Last check time

  created_at          timestamptz       Yes               Created date

  updated_at          timestamptz       Yes               Updated date
  ----------------------------------------------------------------------------

------------------------------------------------------------------------

# 5.12 stock_requests

Stores requests to purchase or reorder stock.

## Fields

  -----------------------------------------------------------------------
  Field             Type              Required          Description
  ----------------- ----------------- ----------------- -----------------
  id                uuid              Yes               Primary key

  organisation_id   uuid              Yes               Linked
                                                        organisation

  house_id          uuid              Yes               Linked house

  stock_item_id     uuid              No                Linked stock item

  requested_by      uuid              Yes               User who
                                                        requested

  approved_by       uuid              No                Manager/team
                                                        leader

  title             text              Yes               Request title

  description       text              No                Details

  status            text              Yes               requested /
                                                        approved /
                                                        ordered /
                                                        received /
                                                        cancelled

  requested_at      timestamptz       Yes               Request timestamp

  approved_at       timestamptz       No                Approval
                                                        timestamp

  received_at       timestamptz       No                Received
                                                        timestamp
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 5.13 audit_logs

Stores immutable audit records.

## Fields

  Field             Type          Required   Description
  ----------------- ------------- ---------- ----------------------------
  id                uuid          Yes        Primary key
  organisation_id   uuid          Yes        Linked organisation
  user_id           uuid          No         User who performed action
  action            text          Yes        Action name
  entity_type       text          Yes        Table/entity affected
  entity_id         uuid          No         Entity ID
  metadata          jsonb         No         Extra details
  ip_address        text          No         User IP address
  device_info       text          No         Browser/device information
  created_at        timestamptz   Yes        Event timestamp

## Rules

-   Audit logs are append-only.
-   Audit logs cannot be edited or deleted by normal users.
-   High-risk actions must always create an audit entry.

------------------------------------------------------------------------

# 6. Optional Future Tables

## 6.1 participants

For MVP, avoid storing participant details unless required.

If needed later:

  Field             Type          Required   Description
  ----------------- ------------- ---------- ------------------------
  id                uuid          Yes        Primary key
  organisation_id   uuid          Yes        Linked organisation
  house_id          uuid          Yes        Linked house
  display_code      text          Yes        Example: Participant A
  initials          text          No         Optional initials
  status            text          Yes        active / inactive
  created_at        timestamptz   Yes        Created date

## Privacy Rule

Avoid storing full participant names, date of birth, Medicare details,
NDIS numbers, or clinical diagnoses unless legally and operationally
required.

------------------------------------------------------------------------

# 7. Relationships

  Relationship                                Type
  ------------------------------------------- -----------------------------------------
  organisation to users                       one-to-many
  organisation to houses                      one-to-many
  user to houses                              many-to-many via user_house_assignments
  house to shifts                             one-to-many
  user to shifts                              one-to-many
  shift to checklist_responses                one-to-many
  checklist_template to checklist_responses   one-to-many
  house to outstanding_tasks                  one-to-many
  shift to outstanding_tasks                  one-to-many
  shift to handover_acknowledgements          one-to-many
  user to audit_logs                          one-to-many

------------------------------------------------------------------------

# 8. Indexing Strategy

Recommended indexes:

``` sql
CREATE INDEX idx_users_organisation_id ON users (organisation_id);
CREATE INDEX idx_houses_organisation_id ON houses (organisation_id);
CREATE INDEX idx_user_house_assignments_user_id ON user_house_assignments (user_id);
CREATE INDEX idx_user_house_assignments_house_id ON user_house_assignments (house_id);
CREATE INDEX idx_shifts_house_id ON shifts (house_id);
CREATE INDEX idx_shifts_user_id ON shifts (user_id);
CREATE INDEX idx_shifts_status ON shifts (status);
CREATE INDEX idx_checklist_responses_shift_id ON checklist_responses (shift_id);
CREATE INDEX idx_outstanding_tasks_house_id ON outstanding_tasks (house_id);
CREATE INDEX idx_outstanding_tasks_status ON outstanding_tasks (status);
CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_audit_logs_organisation_id ON audit_logs (organisation_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);
```

------------------------------------------------------------------------

# 9. Row-Level Security Policies

RLS should be enabled on all key tables.

## 9.1 users

Policy:

-   Users can view their own record.
-   Managers can view users in their organisation.
-   Admins can manage users in their organisation.

## 9.2 houses

Policy:

-   Staff can view assigned houses only.
-   Team leaders can view supervised houses.
-   Managers can view all organisation houses.

## 9.3 shifts

Policy:

-   Staff can create shifts only for assigned houses.
-   Staff can edit only their own active shifts.
-   Submitted shifts are read-only except for authorised manager
    correction.
-   Managers can view shifts within their organisation.

## 9.4 checklist_responses

Policy:

-   Staff can create/edit responses for their own active shift.
-   Staff can view submitted handovers for assigned houses.
-   Managers can view all responses within their organisation.

## 9.5 outstanding_tasks

Policy:

-   Staff can create tasks for assigned houses.
-   Staff can update tasks for assigned houses.
-   Managers can manage all tasks within their organisation.

## 9.6 audit_logs

Policy:

-   Staff cannot modify audit logs.
-   Managers can view audit logs for their organisation.
-   Admins can export audit logs where authorised.

------------------------------------------------------------------------

# 10. Data Retention

Recommended retention:

  Data Type             Suggested Retention
  --------------------- -----------------------------------------
  Shifts                7 years, subject to organisation policy
  Checklist responses   7 years, subject to organisation policy
  Outstanding tasks     7 years
  Audit logs            7 years
  Notifications         12-24 months
  Inactive users        Keep for audit trail, disable access
  Local offline cache   Clear after sync/logout

Retention should be finalised according to organisational legal advice
and NDIS record-keeping requirements.

------------------------------------------------------------------------

# 11. Privacy Controls

The database should avoid unnecessary personal information.

Recommended controls:

-   Use house labels instead of full addresses.
-   Use participant codes instead of full names.
-   Do not store NDIS numbers in MVP.
-   Do not store detailed clinical notes in MVP.
-   Use medication verification only, not medication chart replacement.
-   Limit access by house assignment.
-   Log access to sensitive records.

------------------------------------------------------------------------

# 12. Audit Events

The following events should generate audit logs:

-   User login
-   User logout
-   Shift created
-   Shift cancelled
-   Checklist item updated
-   Handover submitted
-   Handover acknowledged
-   Task created
-   Task updated
-   Task completed
-   Stock request created
-   User role changed
-   House assignment changed
-   Report exported

------------------------------------------------------------------------

# 13. Example SQL Schema Snippets

## shifts

``` sql
CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES organisations(id),
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

## checklist_responses

``` sql
CREATE TABLE checklist_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES shifts(id),
  checklist_template_id uuid NOT NULL REFERENCES checklist_templates(id),
  status text NOT NULL CHECK (status IN ('done', 'not_done', 'not_applicable')),
  comment text,
  completed_by uuid NOT NULL REFERENCES users(id),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT comment_required_when_not_done
    CHECK (status != 'not_done' OR comment IS NOT NULL)
);
```

## outstanding_tasks

``` sql
CREATE TABLE outstanding_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES organisations(id),
  house_id uuid NOT NULL REFERENCES houses(id),
  shift_id uuid REFERENCES shifts(id),
  title text NOT NULL,
  description text,
  category text NOT NULL,
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

------------------------------------------------------------------------

# 14. Reporting Views

Recommended reporting views:

## view_daily_house_summary

Shows daily checklist and task summary per house.

## view_open_tasks_by_house

Shows all open tasks grouped by house.

## view_staff_shift_activity

Shows shifts completed by staff.

## view_missed_required_items

Shows required checklist items marked not done or incomplete.

## view_stock_low_items

Shows stock items marked low or out of stock.

------------------------------------------------------------------------

# 15. Backup and Recovery

Database should support:

-   Daily automated backups
-   Point-in-time recovery
-   Encrypted backup storage
-   Regular restore testing
-   Separate staging and production databases

------------------------------------------------------------------------

# 16. Migration Strategy

Use database migrations for:

-   Schema creation
-   Table changes
-   Index creation
-   RLS policy updates
-   Seed checklist templates

Recommended tools:

-   Supabase migrations
-   Prisma migrations
-   Drizzle migrations

------------------------------------------------------------------------

# 17. Seed Data

Initial seed data should include:

-   Default roles
-   Default checklist sections
-   Default checklist items
-   Demo houses
-   Demo users
-   Default notification types
-   Default stock categories

------------------------------------------------------------------------

# 18. Data Quality Rules

-   Required checklist items must be answered before submission.
-   `not_done` responses require comments.
-   Submitted shifts cannot be edited by normal users.
-   Completed tasks require completion timestamp.
-   User roles must be valid.
-   Inactive users cannot start shifts.
-   Inactive houses cannot receive new shifts.

------------------------------------------------------------------------

# 19. Future Database Enhancements

-   AI analysis results table
-   File attachment table
-   Voice note transcription table
-   Integration sync logs
-   Calendar event mapping
-   Roster import table
-   Multi-language support
-   Data warehouse for analytics

------------------------------------------------------------------------

# 20. Conclusion

The HandoverSafe database design supports a secure, auditable,
mobile-first SIL handover platform.

The schema focuses on structured handover verification, outstanding task
continuity, stock visibility, and privacy-conscious data collection. It
is intentionally lightweight for MVP delivery while remaining extensible
for future integrations, AI support, offline sync, and
multi-organisation deployment.
