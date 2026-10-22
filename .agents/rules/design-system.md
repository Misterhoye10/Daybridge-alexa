---
description: Enforce Daybridge design system tokens, typography, colors, and layout rules
globs: "frontend/**/*.{ts,tsx,css,html}"
---
# Daybridge Design System Rule

All frontend code must strictly obey the specifications in `design/DESIGN.md`:
1. **Semantic Tokens Only**: Never use raw hex codes, arbitrary pixels, or inline font names in component styles. Consume CSS variables from `tokens.css`.
2. **Palette Constraints**:
   - Cool neutral scale: Gray 0 `#FFFFFF` to 950 `#0B0E11`.
   - Single Accent: Harbor (`#0F6F6B` light / `#4FC2BB` dark) used only for action.
   - State colors: Amber (`#FDF0DA`/`#F2A33A`/`#8A5300`), Green (`#E3F4EA`/`#5FCB92`/`#1F7A4D`), Red (`#FBE9E7`/`#FF8A80`/`#B3261E`) used only where state exists.
   - **Prohibited**: No gradients on fills, text, or borders; no glows or glass blur; no purple or cyan; no second brand color; no Alexa ring.
3. **Typography**:
   - Single family: `Geist` (400, 500, 600) for Display, UI, body.
   - Data / Timestamps / Durations: `Geist Mono 500` in chips only.
   - Sentence case everywhere (no ALL CAPS). Tabular figures for progress counters (`tabular-nums`).
4. **Icons**:
   - Lucide icons, 1.75 stroke, outline only.
   - **No sparkle, wand, or robot icons.** Use `lightbulb` for suggestions, `circle-dashed` for awaiting confirmation, `loader-circle` for running, `circle-check` for completed, `circle-x` for failed.
5. **Touch & Accessibility**:
   - 44x44 minimum touch target.
   - WCAG AA contrast (4.5:1 body, 3:1 large text and UI boundaries).
   - Visible 2px Harbor focus ring on keyboard navigation.
