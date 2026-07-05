# HandoverSafe Security & Compliance Guide

**Version:** 1.0\
**Author:** Jesse Songok\
**Date:** July 2026

------------------------------------------------------------------------

# 1. Purpose

This guide defines the security, privacy, governance, and compliance
requirements for HandoverSafe.

HandoverSafe is designed as a **shift handover and operational
accountability platform** for Supported Independent Living (SIL)
services. It complements existing clinical and medication systems and is
intentionally designed to minimise privacy risk by collecting only the
information needed to support effective handovers.

------------------------------------------------------------------------

# 2. Compliance Objectives

The platform should:

-   Protect participant and staff information.
-   Prevent unauthorised access.
-   Maintain an immutable audit trail.
-   Follow privacy-by-design principles.
-   Support providers in meeting Australian regulatory obligations.
-   Reduce cyber security risk.

------------------------------------------------------------------------

# 3. Applicable Australian Frameworks

The application should be designed with regard to:

-   Australian Privacy Principles (APPs)
-   Privacy Act 1988 (Cth)
-   NDIS Practice Standards
-   NDIS Code of Conduct
-   Organisational information security policies
-   Records management obligations applicable to the provider

**Note:** HandoverSafe is not intended to replace official medication
administration records, electronic health records, or incident
management systems.

------------------------------------------------------------------------

# 4. Privacy by Design Principles

The system should:

-   Collect only necessary information.
-   Avoid unnecessary participant identifiers.
-   Default to least privilege access.
-   Encrypt sensitive information.
-   Record access to important information.
-   Support secure deletion where appropriate.
-   Keep users informed of security-relevant actions.

------------------------------------------------------------------------

# 5. Data Classification

  -----------------------------------------------------------------------
  Classification          Examples                Protection
  ----------------------- ----------------------- -----------------------
  Public                  Product documentation   Standard controls

  Internal                House names, stock      Authenticated access
                          lists                   

  Confidential            Shift records,          RBAC + encryption
                          outstanding tasks       

  Restricted              Audit logs,             Strict access and
                          authentication data     monitoring
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 6. Data Minimisation

The MVP should avoid storing:

-   Full participant names where not required
-   Medicare numbers
-   NDIS numbers
-   Clinical diagnoses
-   Medication charts
-   Full clinical progress notes

Instead, use:

-   House identifiers
-   Participant display codes (if needed)
-   Medication verification status only

------------------------------------------------------------------------

# 7. Identity & Access Management

## Authentication

-   Secure password policy
-   Password reset
-   Optional MFA (mandatory for privileged users)
-   Secure session management
-   Automatic logout after inactivity

## Authorisation

Role-based access control (RBAC):

-   Support Worker
-   Team Leader
-   Manager
-   Administrator

Users may only access houses they are authorised to view.

------------------------------------------------------------------------

# 8. Row-Level Security (RLS)

All operational tables should enforce RLS.

Examples:

-   Support workers access assigned houses only.
-   Staff edit only their own active shifts.
-   Managers access organisation data only.
-   Audit logs are read-only for authorised personnel.

------------------------------------------------------------------------

# 9. Encryption

## Data in Transit

-   HTTPS only
-   TLS 1.2 or higher

## Data at Rest

-   Encrypted database storage
-   Encrypted backups
-   Secure cloud storage for attachments

Secrets must never be stored in source code.

------------------------------------------------------------------------

# 10. Audit Logging

Audit events should include:

-   Login
-   Logout
-   Shift creation
-   Checklist changes
-   Handover submission
-   Acknowledgement
-   Task creation
-   Task completion
-   User role changes
-   Report exports

Audit logs should be:

-   Immutable
-   Timestamped
-   Attributable to a user
-   Retained according to organisational policy

------------------------------------------------------------------------

# 11. Secure Development Practices

-   Code reviews
-   Dependency scanning
-   Static analysis
-   Secret scanning
-   Secure CI/CD
-   Environment separation (Development, Staging, Production)

------------------------------------------------------------------------

# 12. Application Security

Protect against:

-   SQL Injection
-   Cross-Site Scripting (XSS)
-   Cross-Site Request Forgery (CSRF)
-   Broken authentication
-   Broken access control
-   Session fixation
-   Clickjacking

Use secure HTTP headers including:

-   HSTS
-   CSP
-   X-Frame-Options
-   X-Content-Type-Options
-   Referrer-Policy

------------------------------------------------------------------------

# 13. Device Security

The PWA should:

-   Avoid permanent local storage of sensitive information.
-   Encrypt offline cache where practical.
-   Clear local data on logout.
-   Require re-authentication after inactivity.

------------------------------------------------------------------------

# 14. Backup & Disaster Recovery

-   Daily encrypted backups
-   Point-in-time recovery
-   Periodic restore testing
-   Documented recovery procedures

Suggested targets:

-   Recovery Time Objective (RTO): 4 hours
-   Recovery Point Objective (RPO): 24 hours (MVP)

------------------------------------------------------------------------

# 15. Monitoring & Incident Response

Monitor:

-   Login failures
-   Permission failures
-   API errors
-   Unusual access patterns
-   Failed synchronisations

Incident process:

1.  Detect
2.  Contain
3.  Investigate
4.  Recover
5.  Notify (where required)
6.  Conduct post-incident review

------------------------------------------------------------------------

# 16. Third-Party Services

Approved services should meet organisational security expectations.

Examples:

-   Vercel
-   Supabase

Before introducing additional services:

-   Review data residency implications
-   Review privacy documentation
-   Assess security controls
-   Minimise data sharing

------------------------------------------------------------------------

# 17. Secure Configuration

-   Separate environments
-   Least privilege service accounts
-   Rotating secrets
-   Environment variables for configuration
-   Disable unused services

------------------------------------------------------------------------

# 18. Secure Coding Checklist

-   Validate all inputs
-   Escape output where required
-   Use parameterised queries
-   Handle errors safely
-   Avoid sensitive data in logs
-   Enforce RBAC on every request
-   Keep dependencies updated

------------------------------------------------------------------------

# 19. Compliance Checklist

Before production:

-   Privacy review completed
-   RLS tested
-   Encryption verified
-   Audit logging enabled
-   Backups configured
-   Security testing completed
-   Accessibility review completed
-   Penetration testing considered
-   Staff training material prepared

------------------------------------------------------------------------

# 20. Operational Security

Organisation administrators should:

-   Review inactive accounts regularly
-   Remove access promptly for departing staff
-   Review role assignments
-   Review audit logs
-   Review open high-priority tasks

------------------------------------------------------------------------

# 21. Future Compliance Enhancements

Potential future improvements:

-   Single Sign-On (SSO)
-   Hardware security keys
-   Advanced SIEM integration
-   Security dashboards
-   Automated compliance reporting
-   External penetration testing
-   ISO 27001-aligned controls
-   SOC 2 readiness

------------------------------------------------------------------------

# 22. Security Responsibilities

## Developers

-   Build securely
-   Review code
-   Fix vulnerabilities promptly

## Administrators

-   Manage users
-   Review logs
-   Maintain configuration

## Managers

-   Ensure appropriate staff access
-   Monitor operational compliance

## Users

-   Protect credentials
-   Report suspicious activity
-   Follow organisational policies

------------------------------------------------------------------------

# 23. Risk Register

  Risk                        Mitigation
  --------------------------- -----------------------------------------
  Unauthorised access         RBAC + RLS + MFA
  Lost device                 Auto logout, minimal local storage
  Data leakage                Encryption and least privilege
  Weak passwords              Password policy and reset controls
  Software vulnerabilities    Regular updates and dependency scanning
  Misconfigured permissions   Periodic access reviews

------------------------------------------------------------------------

# 24. Conclusion

HandoverSafe adopts a security-first, privacy-by-design approach. The
MVP intentionally limits the collection of sensitive information while
providing strong authentication, authorisation, encryption,
auditability, and operational controls.

This approach helps providers improve shift continuity while supporting
Australian privacy expectations and organisational governance
requirements without replacing existing clinical systems.
