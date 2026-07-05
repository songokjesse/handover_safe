# HandoverSafe

## Mobile-First Shift Handover & Accountability Platform for SIL Houses

**Version:** 1.0 (MVP)\
**Author:** Jesse Songok\
**Status:** Product Requirements Document (PRD)

------------------------------------------------------------------------

# 1. Executive Summary

HandoverSafe is a mobile-first application designed specifically for
Supported Independent Living (SIL) homes to improve shift handovers,
reduce missed tasks, and improve accountability between support workers.

Unlike existing care management systems, HandoverSafe does **not**
replace progress notes, medication charts, or rostering software.

Instead, it acts as a **Shift Verification Platform**, ensuring critical
activities have been completed before staff hand over to the next shift.

## Objectives

-   Prevent missed medication confirmations
-   Prevent missed appointments
-   Track outstanding tasks
-   Improve communication between shifts
-   Increase accountability
-   Give managers visibility into recurring operational issues

------------------------------------------------------------------------

# 2. Problem Statement

Current SIL houses often rely on:

-   Verbal handovers
-   Paper communication books
-   Progress notes
-   Staff memory

This can result in:

-   Medication uncertainty
-   Missed appointments
-   Laundry left outside
-   PPE shortages
-   Personal care products not reordered
-   Important follow-up tasks forgotten
-   No clear ownership of incomplete work

------------------------------------------------------------------------

# 3. Vision

> Make every shift handover complete, consistent, accountable, and easy.

------------------------------------------------------------------------

# 4. Goals

-   Reduce communication errors
-   Reduce missed tasks
-   Increase accountability
-   Complete handovers in under 3 minutes
-   Mobile-first experience
-   Minimal staff training

------------------------------------------------------------------------

# 5. Target Users

## Primary

-   Disability Support Workers
-   SIL Support Workers
-   Team Leaders

## Secondary

-   House Coordinators
-   Operations Managers
-   Clinical Managers

------------------------------------------------------------------------

# 6. Platform

## Devices

-   Android
-   iPhone
-   Tablets
-   Desktop (manager dashboard)

## Technology Stack

-   Next.js (PWA)
-   React
-   Supabase
-   PostgreSQL
-   Vercel

------------------------------------------------------------------------

# 7. Core Workflow

``` text
Login
  ↓
Select House
  ↓
Select Shift
  ↓
Complete Checklist
  ↓
Review Outstanding Tasks
  ↓
Submit Handover
  ↓
Incoming Staff Acknowledgement
```

------------------------------------------------------------------------

# 8. House & Shift Selection

Staff self-select:

-   House
-   Shift (AM / PM / Night / Custom)
-   Start Time
-   Finish Time

The system records:

-   User
-   House
-   Shift
-   Date
-   Time

No rostering integration is required for the MVP.

------------------------------------------------------------------------

# 9. Shift Checklist

## Medication

-   Medication administered
-   Medication refused
-   PRN administered
-   Medication issue

## Health Monitoring

-   BGL completed
-   Bowel chart completed
-   IMC recorded
-   Observations completed

## Appointments

-   Appointment attended
-   Transport completed
-   Follow-up required

## Personal Care

-   Shower
-   Oral care
-   Continence support
-   Grooming

## Meals

-   Breakfast
-   Lunch
-   Dinner
-   Fluids monitored

## Housekeeping

-   Laundry washed
-   Laundry collected
-   Laundry folded
-   Dishwasher emptied
-   Kitchen cleaned
-   Bathroom cleaned
-   Bins emptied

## Stock Check

-   Gloves
-   PPE
-   Continence products
-   Cleaning supplies
-   Medication stock

Low stock automatically creates a purchase request.

## Community Access

-   Shopping
-   Recreation
-   Family visit
-   Medical appointment

## Incidents

-   Incident occurred
-   Description
-   Follow-up required

## Outstanding Tasks

Examples:

-   Order gloves
-   Collect laundry
-   Follow up GP
-   Purchase continence products

------------------------------------------------------------------------

# 10. Handover Screen

Displays:

## Outstanding

-   Laundry still outside
-   PPE low
-   Medication refused
-   GP appointment tomorrow

## Completed

-   Medication
-   Meals
-   Shower
-   Community access

------------------------------------------------------------------------

# 11. Smart Alerts

Examples:

-   Medication due but not confirmed
-   Laundry not collected
-   Appointment completed with no outcome recorded
-   PPE low for multiple shifts
-   Repeated medication refusal
-   Outstanding tasks overdue

------------------------------------------------------------------------

# 12. Incoming Staff Acknowledgement

Incoming staff must confirm:

> "I have read and understood today's handover."

Includes:

-   Electronic acknowledgement
-   Timestamp

------------------------------------------------------------------------

# 13. Manager Dashboard

-   Open tasks
-   Overdue tasks
-   House performance
-   Missed checks
-   Stock requests
-   Incidents

------------------------------------------------------------------------

# 14. Reports

-   Daily
-   Weekly
-   Monthly
-   House summary
-   Worker summary
-   Outstanding task report
-   Stock report

------------------------------------------------------------------------

# 15. Notifications

Push notifications for:

-   Medication confirmations
-   Outstanding tasks
-   Low stock
-   Appointment reminders
-   Laundry reminders

------------------------------------------------------------------------

# 16. Privacy & Security

Designed to align with Australian privacy requirements.

Features:

-   Role-based access
-   HTTPS
-   Encrypted database
-   Secure authentication
-   Automatic logout
-   Audit logs
-   Minimal participant information
-   No permanent participant data stored on devices

------------------------------------------------------------------------

# 17. User Roles

## Support Worker

-   Complete checklist
-   Submit handover

## Team Leader

-   Review handovers
-   Assign and close tasks

## Manager

-   Reports
-   Analytics
-   House oversight

## Administrator

-   User management
-   House management
-   System settings

------------------------------------------------------------------------

# 18. Audit Trail

Every action is logged.

Example:

-   Login
-   Shift started
-   Medication confirmed
-   Laundry completed
-   Handover submitted
-   Incoming staff acknowledged

------------------------------------------------------------------------

# 19. AI Features (Future)

-   Compare checklist against progress notes
-   Detect missing documentation
-   Summarise handovers
-   Predict recurring issues
-   Trend analysis

------------------------------------------------------------------------

# 20. Offline Mode

-   Continue working offline
-   Secure local cache
-   Automatic sync
-   Duplicate prevention

------------------------------------------------------------------------

# 21. Future Integrations

-   Rostering systems (read-only)
-   Medication management systems
-   Calendar systems
-   Microsoft Teams
-   Email
-   SMS

------------------------------------------------------------------------

# 22. Success Metrics

-   Reduced missed tasks
-   Reduced missed appointments
-   Reduced medication uncertainty
-   Reduced PPE shortages
-   Faster handovers
-   Improved staff satisfaction

------------------------------------------------------------------------

# 23. Roadmap

## MVP

-   Login
-   House selection
-   Shift selection
-   Checklist
-   Outstanding tasks
-   Handover acknowledgement

## Version 2

-   Push notifications
-   Reports
-   Analytics
-   Offline mode
-   Stock management

## Version 3

-   AI assistant
-   Predictive alerts
-   Voice handovers
-   Smart summaries
-   Integrations

------------------------------------------------------------------------

# 24. Technical Architecture

## Frontend

-   Next.js
-   React
-   Tailwind CSS
-   shadcn/ui

## Backend

-   Supabase
-   PostgreSQL
-   Row-Level Security

## Authentication

-   Supabase Auth

## Storage

-   Supabase Storage

## Hosting

-   Vercel

------------------------------------------------------------------------

# 25. Competitive Advantage

HandoverSafe complements existing systems rather than replacing them.

Key differentiators:

-   Mobile-first
-   Self-service shift selection
-   Structured handovers
-   Outstanding task tracking
-   Smart alerts
-   Privacy by design
-   AI-ready architecture

------------------------------------------------------------------------

# Long-Term Vision

Become Australia's leading operational handover platform for Supported
Independent Living providers by ensuring every shift ends with
confidence and every incoming worker starts with complete, actionable
information.
