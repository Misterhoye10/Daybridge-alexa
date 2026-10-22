---
name: ds-audit
description: Run accessibility, token compliance, contrast, and visual regression audit
---
# /ds-audit Skill

## Responsibilities
1. Audit color contrast against WCAG AA standards (4.5:1 body, 3:1 large text and borders).
2. Validate zero raw hex/pixel leaks outside token files.
3. Verify touch targets (44x44 minimum).
4. Verify keyboard accessibility and screen-reader polite aria announcements.
5. Generate `design/audit/REPORT.md` confirming zero critical or serious violations.
