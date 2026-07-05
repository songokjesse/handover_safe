# HandoverSafe Development Roadmap

**Version:** 1.0\
**Author:** Jesse Songok\
**Date:** July 2026

------------------------------------------------------------------------

# Vision

Build the leading mobile-first shift handover and accountability
platform for Supported Independent Living (SIL) providers in Australia.

------------------------------------------------------------------------

# Guiding Principles

-   Mobile-first
-   Simple enough to complete a handover in under 3 minutes
-   Privacy by design
-   Incremental releases
-   Validate with real SIL staff before adding complexity
-   Integrate with existing systems rather than replacing them

------------------------------------------------------------------------

# Phase 0 -- Discovery (2 Weeks)

## Goals

-   Validate workflow with support workers
-   Interview Team Leaders and Managers
-   Confirm Australian privacy and NDIS requirements
-   Finalise MVP scope

### Deliverables

-   PRD
-   SRS
-   SAD
-   DDD
-   UI wireframes
-   Product backlog

------------------------------------------------------------------------

# Phase 1 -- MVP Foundation (6 Weeks)

## Epic 1 -- Authentication

User stories

-   Login
-   Logout
-   Password reset
-   Role-based access

## Epic 2 -- House & Shift

-   Select assigned house
-   Select AM / PM / Night / Custom
-   Duplicate shift detection

## Epic 3 -- Checklist

-   Dynamic checklist
-   Done / Not Done / N/A
-   Mandatory comments for Not Done

## Epic 4 -- Outstanding Tasks

-   Create task
-   Carry forward
-   Complete task

## Epic 5 -- Handover

-   Submit handover
-   Incoming acknowledgement

## Epic 6 -- Audit Logging

-   Log all major actions

### Milestone

Usable in one SIL house.

------------------------------------------------------------------------

# Phase 2 -- Pilot (4 Weeks)

Deploy to 2--3 SIL houses.

## Features

-   Manager dashboard
-   Daily reports
-   Weekly reports
-   Notification centre
-   Basic stock management
-   Bug fixes

### Success Criteria

-   90% shift completion

-   Positive staff feedback

-   Reduced missed tasks

------------------------------------------------------------------------

# Phase 3 -- Production (6 Weeks)

## Features

-   Offline support
-   Push notifications
-   Export PDF/CSV
-   Improved analytics
-   Performance optimisation
-   Accessibility improvements

### Milestone

Ready for provider-wide deployment.

------------------------------------------------------------------------

# Phase 4 -- Multi-Provider (8 Weeks)

## Features

-   Multi-organisation support
-   Tenant isolation
-   Organisation branding
-   House templates
-   Advanced permissions

------------------------------------------------------------------------

# Phase 5 -- Integrations (6 Weeks)

Potential integrations

-   Read-only rostering
-   Calendar
-   Medication verification systems
-   Email
-   SMS
-   Microsoft Teams

------------------------------------------------------------------------

# Phase 6 -- AI Assistant (8 Weeks)

## AI Features

-   Detect missing checklist items
-   Compare handover with progress notes
-   Highlight inconsistencies
-   Summarise outgoing shifts
-   Predict recurring issues

Human review remains mandatory.

------------------------------------------------------------------------

# Sprint Plan

## Sprint 1

-   Project setup
-   Authentication
-   Database
-   Roles

## Sprint 2

-   House selection
-   Shift creation
-   Checklist templates

## Sprint 3

-   Checklist responses
-   Validation
-   Handover submission

## Sprint 4

-   Outstanding tasks
-   Notifications
-   Audit logs

## Sprint 5

-   Manager dashboard
-   Reports
-   Testing

## Sprint 6

-   Pilot deployment
-   Bug fixes
-   Documentation

------------------------------------------------------------------------

# Definition of Done

A feature is complete when:

-   Functional requirements met
-   Unit tests pass
-   Security reviewed
-   Mobile responsive
-   Accessibility checked
-   Audit logging implemented
-   Documentation updated
-   Accepted by product owner

------------------------------------------------------------------------

# Recommended Team

  Role                     FTE
  --------------------- ------
  Product Owner            0.5
  Technical Lead             1
  Full Stack Engineer        2
  UI/UX Designer           0.5
  QA Engineer                1
  DevOps                  0.25

For MVP, a 2--3 developer team is sufficient.

------------------------------------------------------------------------

# Risks

  Risk               Mitigation
  ------------------ -------------------------------
  Low adoption       Keep workflow under 3 minutes
  Scope creep        Strict MVP backlog
  Privacy concerns   Privacy by design
  Offline usage      Implement local sync
  Duplicate data     Validation and audit logs

------------------------------------------------------------------------

# KPIs

-   Handover completion rate
-   Outstanding tasks completed within SLA
-   Reduction in missed appointments
-   Reduction in missed stock orders
-   Average handover completion time
-   Staff satisfaction
-   Manager satisfaction

------------------------------------------------------------------------

# Release Strategy

## Alpha

Internal testing by developers.

## Beta

Pilot in one provider with selected houses.

## General Availability

Commercial release following successful pilot and security review.

------------------------------------------------------------------------

# Long-Term Roadmap

-   AI assistant
-   Voice handovers
-   Barcode stock scanning
-   QR code house check-in
-   Advanced analytics
-   Multi-language support
-   Public API
-   Native mobile apps if required

------------------------------------------------------------------------

# Estimated Timeline

  Phase              Duration
  ---------------- ----------
  Discovery           2 weeks
  MVP                 6 weeks
  Pilot               4 weeks
  Production          6 weeks
  Multi-provider      8 weeks
  Integrations        6 weeks
  AI Features         8 weeks

Total estimated roadmap: **\~40 weeks**, with an MVP available after
approximately **8 weeks** including discovery.
