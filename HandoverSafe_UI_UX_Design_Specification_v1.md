# HandoverSafe UI/UX Design Specification

**Version:** 1.0\
**Author:** Jesse Songok\
**Date:** July 2026

------------------------------------------------------------------------

# 1. Purpose

This document defines the user experience, interface standards,
navigation, accessibility, and screen designs for the HandoverSafe
mobile-first Progressive Web App (PWA).

Primary design goals:

-   Complete a handover in under **3 minutes**
-   One-handed mobile use
-   Minimal typing
-   Clear visual status
-   Accessible and consistent interface

------------------------------------------------------------------------

# 2. Design Principles

-   Mobile-first
-   Large touch targets (minimum 44×44px)
-   Plain English
-   Progressive disclosure
-   Privacy by design
-   High contrast
-   Fast interactions
-   Offline-friendly

------------------------------------------------------------------------

# 3. Design System

## Colours

  Purpose      Colour
  ------------ ---------
  Primary      #2563EB
  Success      #16A34A
  Warning      #F59E0B
  Error        #DC2626
  Background   #F8FAFC
  Surface      #FFFFFF
  Text         #0F172A

## Typography

-   Headings: Inter Semibold
-   Body: Inter Regular
-   Minimum body size: 16px

## Icons

Use a single icon library (e.g. Lucide).

Examples:

-   House
-   Checklist
-   Medication
-   Bell
-   Laundry
-   Stock
-   Calendar
-   User
-   Alert
-   Settings

------------------------------------------------------------------------

# 4. Navigation

Bottom navigation (Support Worker):

1.  Home
2.  Tasks
3.  Notifications
4.  Profile

Manager navigation adds:

-   Dashboard
-   Reports

------------------------------------------------------------------------

# 5. User Journey

``` text
Login
 ↓
Select House
 ↓
Select Shift
 ↓
Checklist
 ↓
Outstanding Tasks
 ↓
Review
 ↓
Submit
 ↓
Incoming Staff Acknowledges
```

------------------------------------------------------------------------

# 6. Screen Specifications

## 6.1 Login

Components:

-   Logo
-   Email
-   Password
-   Sign In
-   Forgot Password

Success:

Navigate to House Selection.

------------------------------------------------------------------------

## 6.2 House Selection

Cards display:

-   House Name
-   Status
-   Last handover time

Primary action:

"Start Shift"

------------------------------------------------------------------------

## 6.3 Shift Selection

Options:

-   AM
-   PM
-   Night
-   Custom

Fields:

-   Start time
-   Finish time

Primary button:

"Begin Shift"

------------------------------------------------------------------------

## 6.4 Home Dashboard

Displays:

-   Active shift
-   Outstanding tasks
-   Notifications
-   Quick actions

Quick actions:

-   Open Checklist
-   View Previous Handover
-   Stock Check
-   Finish Shift

------------------------------------------------------------------------

## 6.5 Checklist Screen

Grouped accordion sections:

-   Medication
-   Health
-   Personal Care
-   Meals
-   Housekeeping
-   Stock
-   Community Access
-   Incidents

Each item supports:

-   Done
-   Not Done
-   N/A

If "Not Done" is selected:

-   Comment field appears automatically.

Progress bar displayed at top.

Sticky "Continue" button.

------------------------------------------------------------------------

## 6.6 Outstanding Tasks

Cards display:

-   Title
-   Priority
-   Due
-   Status

Actions:

-   Complete
-   Assign
-   View Details

Floating Action Button:

"+ New Task"

------------------------------------------------------------------------

## 6.7 Handover Review

Summary:

-   Checklist completion
-   Outstanding tasks
-   Warnings

CTA:

"Submit Handover"

------------------------------------------------------------------------

## 6.8 Incoming Acknowledgement

Displays:

-   Previous shift summary
-   Outstanding tasks
-   Alerts

Button:

"I've Read This Handover"

------------------------------------------------------------------------

## 6.9 Notifications

Filter:

-   All
-   Tasks
-   Stock
-   Appointments
-   System

Swipe actions:

-   Mark Read
-   Archive

------------------------------------------------------------------------

## 6.10 Profile

-   Name
-   Role
-   Assigned Houses
-   Dark Mode
-   Logout

------------------------------------------------------------------------

## 6.11 Manager Dashboard

Widgets:

-   Today's handovers
-   Open tasks
-   Low stock
-   Compliance
-   Recent incidents

Charts:

-   Task completion
-   Missed items
-   Handover completion rate

------------------------------------------------------------------------

# 7. Components

Reusable components:

-   Button
-   Card
-   Status Chip
-   Accordion
-   Progress Bar
-   Bottom Sheet
-   Floating Action Button
-   Search
-   Modal
-   Toast
-   Empty State
-   Loading Skeleton

------------------------------------------------------------------------

# 8. Interaction Patterns

-   Tap to complete checklist item
-   Long press for details
-   Swipe notification actions
-   Pull to refresh
-   Auto-save after every change

------------------------------------------------------------------------

# 9. Accessibility

Target:

WCAG 2.2 AA

Requirements:

-   Screen reader labels
-   Keyboard support
-   High colour contrast
-   Focus indicators
-   Minimum touch size
-   Dynamic text support

------------------------------------------------------------------------

# 10. Responsive Behaviour

Breakpoints:

-   Mobile: default
-   Tablet: expanded cards
-   Desktop: dashboard layout

------------------------------------------------------------------------

# 11. Empty States

Examples:

"No outstanding tasks."

"You're all caught up."

"No notifications."

------------------------------------------------------------------------

# 12. Error States

Examples:

"No internet connection."

"Unable to submit handover."

"Session expired."

Each includes a clear recovery action.

------------------------------------------------------------------------

# 13. Offline UX

Indicators:

-   Offline badge
-   Pending sync counter

Actions:

-   Continue working
-   Sync automatically when online

------------------------------------------------------------------------

# 14. Motion

Use subtle animations only:

-   Card elevation
-   Progress updates
-   Success checkmark
-   Toast notifications

Avoid distracting animations.

------------------------------------------------------------------------

# 15. Future Screens

-   AI Assistant
-   Voice Handover
-   QR House Check-In
-   Barcode Stock Scan
-   Multi-provider Admin
-   Organisation Settings

------------------------------------------------------------------------

# 16. Design Tokens

Spacing: 4, 8, 12, 16, 24, 32 px

Border radius:

-   Cards: 16px
-   Buttons: 12px

Shadow:

-   Small
-   Medium

------------------------------------------------------------------------

# 17. Prototype Deliverables

Low-fidelity wireframes:

-   Login
-   House Selection
-   Shift Selection
-   Home
-   Checklist
-   Tasks
-   Review
-   Manager Dashboard

High-fidelity prototype:

-   Clickable mobile prototype
-   Design system
-   Component library

------------------------------------------------------------------------

# 18. UX Success Metrics

-   Handover completed in under 3 minutes

-   \<2 taps to access checklist

-   90% checklist completion

-   Low error rate

-   Positive usability feedback

------------------------------------------------------------------------

# 19. Recommended Tools

-   Figma
-   FigJam
-   Tailwind CSS
-   shadcn/ui

------------------------------------------------------------------------

# 20. Design Vision

The interface should feel calm, trustworthy, and efficient---helping
support workers focus on participants rather than paperwork. Every
screen should reduce cognitive load, minimise typing, and surface only
the information needed at that moment.
