# HandoverSafe Testing & QA Plan

**Version:** 1.0\
**Author:** Jesse Songok\
**Date:** July 2026\
**System:** HandoverSafe\
**Document Type:** Testing & Quality Assurance Plan

------------------------------------------------------------------------

# 1. Purpose

This Testing & QA Plan defines the quality assurance approach for
**HandoverSafe**, a mobile-first Progressive Web App (PWA) designed for
Supported Independent Living (SIL) shift handovers, task checks, and
operational accountability.

The purpose of this plan is to ensure that HandoverSafe is:

-   Reliable
-   Secure
-   Mobile-friendly
-   Accessible
-   Privacy-conscious
-   Easy for support workers to use
-   Suitable for pilot and production deployment

------------------------------------------------------------------------

# 2. Testing Objectives

The testing process must verify that:

-   Users can securely log in and access only authorised houses.
-   Staff can select a house and shift correctly.
-   Checklist items can be completed accurately.
-   Mandatory items cannot be skipped.
-   "Not Done" items require comments.
-   Outstanding tasks carry forward to the next shift.
-   Incoming staff can acknowledge handovers.
-   Managers can view dashboards and reports.
-   Audit logs are created for key actions.
-   The app works well on mobile devices.
-   The app handles offline or poor internet conditions.
-   Privacy and security controls are effective.

------------------------------------------------------------------------

# 3. Scope

## In Scope

-   Functional testing
-   Mobile testing
-   Usability testing
-   Accessibility testing
-   Security testing
-   Privacy testing
-   Performance testing
-   Regression testing
-   User Acceptance Testing
-   Offline sync testing
-   Cross-browser testing

## Out of Scope for MVP

-   Native app store testing
-   Full medication administration system testing
-   Complex roster integration testing
-   AI assistant validation
-   Third-party clinical system integration testing

------------------------------------------------------------------------

# 4. Test Environments

## Development

Used by developers for early testing.

## Staging

Used for QA, UAT, demo testing, and release validation.

## Production

Live environment used by real providers and staff.

Each environment should have:

-   Separate database
-   Separate authentication configuration
-   Separate storage bucket
-   Separate API keys
-   Separate test users

------------------------------------------------------------------------

# 5. Test User Roles

Testing must include all user roles.

  Role             Test Focus
  ---------------- -----------------------------------------
  Support Worker   Shift start, checklist, tasks, handover
  Team Leader      Review, task management, corrections
  Manager          Dashboard, reports, oversight
  Administrator    User, house, role management

------------------------------------------------------------------------

# 6. Test Data

Test data should include:

-   Multiple organisations
-   Multiple SIL houses
-   Multiple staff users
-   Active and inactive users
-   Active and inactive houses
-   AM, PM, Night, and Custom shifts
-   Required and optional checklist items
-   Open, overdue, and completed tasks
-   Low stock scenarios
-   Missed medication verification scenarios
-   Missed appointment scenarios

No real participant personal information should be used in testing
unless approved and de-identified.

------------------------------------------------------------------------

# 7. Functional Test Areas

## 7.1 Authentication

Test cases:

-   User can log in with valid credentials.
-   User cannot log in with invalid credentials.
-   User can reset password.
-   Session expires after inactivity.
-   Inactive user cannot log in.
-   User logout clears session.

------------------------------------------------------------------------

## 7.2 House Access

Test cases:

-   User can see assigned houses only.
-   User cannot access unauthorised houses.
-   Manager can see houses under their organisation.
-   Inactive houses cannot be selected for new shifts.

------------------------------------------------------------------------

## 7.3 Shift Selection

Test cases:

-   User can select AM shift.
-   User can select PM shift.
-   User can select Night shift.
-   User can create Custom shift.
-   Duplicate active shift warning appears.
-   One user cannot start two active shifts at the same time.
-   Shift times are saved correctly.

------------------------------------------------------------------------

## 7.4 Checklist Completion

Test cases:

-   Checklist loads for selected house and shift.
-   User can mark item as Done.
-   User can mark item as Not Done.
-   User can mark item as N/A.
-   Not Done requires comment.
-   Required checklist items cannot be skipped.
-   Progress bar updates correctly.
-   Checklist autosaves after changes.

------------------------------------------------------------------------

## 7.5 Medication Verification

Test cases:

-   Medication item can be marked Done / Not Done / N/A.
-   Not Done requires reason.
-   Medication issue creates warning.
-   Medication verification wording does not replace official medication
    administration record.

------------------------------------------------------------------------

## 7.6 Outstanding Tasks

Test cases:

-   User can create task.
-   User can set priority.
-   User can set due date.
-   Task appears in next shift.
-   User can mark task complete.
-   Completed task disappears from open list.
-   Overdue task is highlighted.
-   Urgent task creates notification.

------------------------------------------------------------------------

## 7.7 Handover Submission

Test cases:

-   User cannot submit incomplete required checklist.
-   User can review summary before submission.
-   Submitted handover becomes read-only.
-   Audit log is created.
-   Submitted handover appears for incoming staff.

------------------------------------------------------------------------

## 7.8 Incoming Staff Acknowledgement

Test cases:

-   Incoming staff can view previous handover.
-   Incoming staff can acknowledge handover.
-   Acknowledgement records timestamp.
-   Same user cannot duplicate acknowledgement.
-   Acknowledgement appears in audit log.

------------------------------------------------------------------------

## 7.9 Manager Dashboard

Test cases:

-   Manager can view open tasks.
-   Manager can view overdue tasks.
-   Manager can view missed checklist items.
-   Manager can filter by house.
-   Manager can filter by date.
-   Manager can export reports.

------------------------------------------------------------------------

## 7.10 Notifications

Test cases:

-   User receives task notification.
-   User receives stock notification.
-   User receives missing checklist notification.
-   User can mark notification as read.
-   Notification count updates correctly.

------------------------------------------------------------------------

# 8. Non-Functional Testing

## 8.1 Performance Testing

Targets:

-   Initial page load under 2 seconds on 4G.
-   Checklist screen loads under 1 second.
-   Checklist save action completes under 1 second.
-   Dashboard loads under 3 seconds.
-   Supports at least 500 concurrent users for MVP target.

Test scenarios:

-   50 users submitting checklists simultaneously.
-   100 users viewing dashboards.
-   Large audit log queries.
-   Large outstanding task lists.

------------------------------------------------------------------------

## 8.2 Security Testing

Security tests:

-   Authentication bypass attempts.
-   Role escalation attempts.
-   Unauthorised house access attempts.
-   Row-Level Security validation.
-   SQL injection testing.
-   Cross-site scripting testing.
-   Session hijacking checks.
-   Password reset abuse checks.
-   Secure headers validation.

------------------------------------------------------------------------

## 8.3 Privacy Testing

Privacy checks:

-   Staff cannot access unassigned houses.
-   Participant names are not required in MVP.
-   Local device storage is minimised.
-   Logout clears local data.
-   Reports do not expose unnecessary sensitive details.
-   Audit logs track access to sensitive records.
-   Test data is de-identified.

------------------------------------------------------------------------

## 8.4 Accessibility Testing

Target:

-   WCAG 2.2 AA

Tests:

-   Screen reader navigation.
-   Keyboard navigation.
-   Sufficient colour contrast.
-   Focus indicators.
-   Large touch targets.
-   Text scaling.
-   Form labels.
-   Error messages are clear.
-   Buttons have accessible names.

------------------------------------------------------------------------

## 8.5 Mobile Testing

Devices:

-   iPhone Safari
-   Android Chrome
-   iPad Safari
-   Android tablet Chrome

Test scenarios:

-   Portrait mode
-   Landscape mode
-   Small screen devices
-   Large screen devices
-   Poor network
-   Offline mode
-   Add to home screen
-   PWA launch

------------------------------------------------------------------------

## 8.6 Browser Testing

Browsers:

-   Chrome
-   Safari
-   Edge
-   Firefox

Priority:

-   Mobile Safari
-   Mobile Chrome
-   Desktop Chrome
-   Desktop Edge

------------------------------------------------------------------------

# 9. Offline Testing

Test cases:

-   User opens checklist online.
-   User loses internet.
-   User continues completing checklist.
-   Changes are stored locally.
-   User reconnects.
-   Data syncs successfully.
-   Duplicate submission is prevented.
-   Sync conflict is flagged.
-   Offline indicator appears clearly.

------------------------------------------------------------------------

# 10. Regression Testing

Regression testing should be performed before each release.

Core regression checklist:

-   Login
-   House selection
-   Shift selection
-   Checklist completion
-   Handover submission
-   Incoming acknowledgement
-   Task creation
-   Task completion
-   Manager dashboard
-   Audit logs
-   Notifications
-   Reports

------------------------------------------------------------------------

# 11. User Acceptance Testing

UAT should involve:

-   Support workers
-   Team leaders
-   Managers

## UAT Scenarios

### Scenario 1: Normal PM Shift Handover

-   Staff selects House A.
-   Selects PM shift.
-   Completes checklist.
-   Creates one outstanding task.
-   Submits handover.
-   Incoming staff acknowledges.

### Scenario 2: Medication Not Confirmed

-   Staff marks medication verification as Not Done.
-   System requires reason.
-   Handover shows warning.
-   Manager can review.

### Scenario 3: Laundry Not Collected

-   Staff creates outstanding laundry task.
-   Incoming staff sees task.
-   Incoming staff completes task.

### Scenario 4: PPE Low

-   Staff marks PPE as low.
-   System creates stock request.
-   Manager views stock issue.

### Scenario 5: Missed Appointment

-   Staff marks appointment as not attended.
-   System requires reason.
-   Manager report displays missed appointment.

------------------------------------------------------------------------

# 12. Acceptance Criteria

The MVP can be accepted when:

-   All critical functional tests pass.
-   No critical security vulnerabilities remain.
-   Role-based access works correctly.
-   Checklist submission works on mobile devices.
-   Outstanding tasks carry forward correctly.
-   Audit logs are generated correctly.
-   UAT users can complete handover in under 3 minutes.
-   Mobile usability feedback is acceptable.
-   Production deployment checklist is complete.

------------------------------------------------------------------------

# 13. Defect Severity

  -----------------------------------------------------------------------
  Severity                Description             Example
  ----------------------- ----------------------- -----------------------
  Critical                Blocks core system or   User can access
                          exposes data            unauthorised house

  High                    Major feature broken    Cannot submit handover

  Medium                  Workaround exists       Report filter not
                                                  working

  Low                     Minor issue             Button alignment issue
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 14. Bug Reporting Template

Each bug report should include:

-   Title
-   Environment
-   Device
-   Browser
-   User role
-   Steps to reproduce
-   Expected result
-   Actual result
-   Screenshots/video
-   Severity
-   Assigned developer
-   Status

------------------------------------------------------------------------

# 15. Test Automation

Recommended automated tests:

## Unit Tests

-   Validation rules
-   Role permissions
-   Checklist logic
-   Task status logic

## Integration Tests

-   Shift creation
-   Checklist submission
-   Handover acknowledgement
-   Task carry-forward
-   Report generation

## End-to-End Tests

Use Playwright or Cypress.

E2E flows:

-   Login to handover submission
-   Incoming acknowledgement
-   Manager dashboard review
-   Offline sync flow

------------------------------------------------------------------------

# 16. Security Release Gate

Before production:

-   RLS policies tested.
-   No unauthorised cross-house access.
-   No critical dependency vulnerabilities.
-   HTTPS enabled.
-   Secure headers configured.
-   Secrets not exposed.
-   Audit logs enabled.
-   Backup and recovery confirmed.

------------------------------------------------------------------------

# 17. Performance Release Gate

Before production:

-   Checklist loads under 1 second.
-   Handover submits under 1 second.
-   Dashboard loads under 3 seconds.
-   No critical slow database queries.
-   Indexes reviewed.
-   Large task lists perform acceptably.

------------------------------------------------------------------------

# 18. Accessibility Release Gate

Before production:

-   WCAG 2.2 AA critical items passed.
-   Keyboard navigation works.
-   Screen reader labels added.
-   Colour contrast passed.
-   Form errors are accessible.
-   Touch targets meet minimum size.

------------------------------------------------------------------------

# 19. Production Readiness Checklist

-   Staging testing completed.
-   UAT completed.
-   Security testing completed.
-   Privacy review completed.
-   Accessibility review completed.
-   Backup enabled.
-   Monitoring enabled.
-   Error tracking enabled.
-   Rollback plan documented.
-   Admin users configured.
-   Staff training material prepared.

------------------------------------------------------------------------

# 20. QA Tools

Recommended tools:

-   Playwright or Cypress
-   Vitest or Jest
-   React Testing Library
-   Lighthouse
-   axe DevTools
-   Sentry
-   Supabase logs
-   Vercel analytics
-   GitHub Issues or Linear

------------------------------------------------------------------------

# 21. Testing Schedule

## Sprint Testing

Testing occurs throughout each sprint.

## Release Testing

Full regression and UAT occur before each release.

## Post-Release Testing

Monitor:

-   Error rates
-   Failed syncs
-   Login failures
-   User feedback
-   Support tickets

------------------------------------------------------------------------

# 22. QA Metrics

Track:

-   Test pass rate
-   Defect count by severity
-   Defect resolution time
-   Regression failure rate
-   UAT completion rate
-   Average handover completion time
-   Production incident count

------------------------------------------------------------------------

# 23. Risks and Mitigations

  Risk                          Mitigation
  ----------------------------- -----------------------------------------
  Staff find app too slow       Mobile usability testing
  Privacy issue missed          Privacy test cases and RLS testing
  Poor offline reliability      Offline test scenarios
  Bugs in handover submission   Automated E2E testing
  Reports inaccurate            Integration and data validation testing
  Accessibility failures        Early accessibility testing

------------------------------------------------------------------------

# 24. Conclusion

The HandoverSafe QA approach focuses on safety, usability, privacy, and
reliability.

Because the system supports operational handovers in SIL homes, testing
must prioritise:

-   Correct access control
-   Accurate task carry-forward
-   Reliable handover submission
-   Clear mobile usability
-   Auditability
-   Privacy protection

A successful QA process will ensure HandoverSafe can be trusted by
frontline staff, team leaders, and managers before pilot and production
deployment.
