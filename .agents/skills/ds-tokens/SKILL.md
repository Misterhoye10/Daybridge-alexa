---
name: ds-tokens
description: Generate and verify Daybridge design tokens, CSS variables, and swatch verification view
---
# /ds-tokens Skill

## Responsibilities
1. Generate `design/tokens.json` from the specifications in `design/DESIGN.md`.
2. Generate `frontend/src/styles/tokens.css` with Gray neutral scale, Harbor accent, Amber/Green/Red state triples, typography scales, radii, and motion tokens.
3. Configure Google Fonts (`Geist:400,500,600`, `Geist Mono:500`).
4. Ensure ThemeProvider handles light and dark mode using `data-theme` attribute, defaulting to system preference.
5. Create a token swatch & verification gallery route or component.
6. Publish Phase 1 review artifact with token summary and contrast checks.
