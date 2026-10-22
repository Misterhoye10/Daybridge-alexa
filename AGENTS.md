# Daybridge Agent Instructions

## Product Context
Daybridge is an AI personal assistant that transforms conversational intentions into structured, actionable plans with real backend state execution.
Built as an Alexa+-inspired simulation web app for the Amazon Developer Hackathon 2026.

## Non-Negotiable Design & Brand Rules
- Single source of truth: `design/DESIGN.md`
- **Brand Identity**: Calm, Capable, Honest, Warm. (No cutesy/chatty language, no emojis in copy, no exclamation marks).
- **Alexa+ Framing**: Borrow the interaction model (request, interpretation, action, result) only. **NO Alexa ring, NO Amazon marks, NO cyan.**
- **Color Palette**: Cool neutral scale (Gray 0-950) with one accent: Harbor (`#0F6F6B` light / `#4FC2BB` dark) used only for action. Amber, green, and red exist only to show state. No gradients.
- **Logo Mark**: The arch with dot (`32x32` grid). Arch Gray 900 / dot Harbor 600 (dark: Arch Gray 50 / dot Harbor 400). The mark is static; loading is shown by PipelineTrace, never by animating the logo.
- **Truthful State**: Completed renders ONLY from a confirmed backend success. Past tense is forbidden until confirmed.
- **Typography**: Geist 400, 500, 600 (Display, UI, body), Geist Mono 500 (data).
- **Iconography**: Lucide outline, 1.75 stroke. **No sparkle icon for AI.**

## Design System Workflow Order
When executing design system skills, always proceed through the gates in this order:
1. `/ds-tokens`
2. `/ds-slice`
3. `/ds-connect`
4. `/ds-audit`
5. `/ds-components`, `/ds-screens`, `/ds-handoff`
