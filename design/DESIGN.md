# Daybridge: Brand Guidelines & Design System
Oct 21, 2026 · @Talodabioluwa

## 1. Brand foundation
Daybridge's brand rests on one idea: **honest action**. Whatever it says it did, it did, and it shows exactly what changed.

- **Positioning**: For people who know what they want done but not how to sequence it, Daybridge turns a spoken request into a plan, and the plan into finished tasks. Unlike a chatbot that stops at advice, it acts and reports the result truthfully.
- **Brand idea**: The bridge between intention and action. The name joins day and bridge: crossing from "I should" to "done" within one day.
- **Tagline**: Say it. Plan it. Get it done.
- **Promise**: Turn intentions into plans, and plans into action.
- **Brand in three words**: Clear. Calm. Honest.

| Trait | We are | We are not |
| :--- | :--- | :--- |
| **Calm** | Unhurried, one next step at a time | Alarming, streak-driven, notification-heavy |
| **Capable** | Specific, shows its work | Magical, vague, hand-wavy |
| **Honest** | States what changed and what did not | Claiming success it cannot verify |
| **Warm** | Plain, brief, human | Cutesy, chatty, emoji-heavy |

**Alexa+ framing**: The simulation borrows the interaction model (request, interpretation, action, result), not Amazon's identity. **No Alexa ring, no Amazon marks or cyan.** Use "Alexa+-inspired" in submission copy only, and confirm wording against the official hackathon rules.

### Look and feel
Clean, precise, quiet. The interface should read as a well-made tool, not a demo. Five principles:
1. **Structure over decoration**: Hairlines, spacing, and alignment separate content. Shadows, fills, and color do not.
2. **One accent, used for action only**: Every other color means state.
3. **Content first**: Chrome recedes; the conversation and the plan are the interface.
4. **Precision**: A 4 px grid, optical alignment, one radius family, one type family.
5. **Every element has a job**: If it neither informs nor enables, remove it.

### Banned patterns
These are what make an interface look machine-made. The build lints for them.

| Banned | Use instead |
| :--- | :--- |
| Gradients on fills, text, or borders; glows; glass blur | Flat fills and 1 px borders |
| Sparkle, wand, or robot icons; "AI" badges | Plain verbs and the product's own icons |
| Purple or blue-violet accents | Harbor, used sparingly |
| Colored left-border accent bars on cards | A state icon plus a text label |
| Cards nested in cards; card grids as page layout | One surface level, divided by hairlines |
| Large radii and pill-shaped cards | Radius sm to lg, section 7 |
| Stacked or colored shadows | A border at rest, one shadow on overlays only |
| Decorative illustration, emoji, confetti | Type, space, and the mark |
| Shimmering or typewriter "thinking" text | PipelineTrace with real stages |
| Centered hero layouts inside the app | Left-aligned, grid-based layout |
| More than one accent color on a screen | State colors only where a state exists |

---

## 2. Voice and messaging
Daybridge sounds like a capable friend who already made the checklist: short, specific, and never overselling.

### Voice rules
1. Lead with the result or the next step, then the reason.
2. Name the object. "Added Mock interview to Thursday" beats "Done".
3. Report state truthfully: say what changed and what did not.
4. One idea per message, under 20 words per sentence in the UI.
5. Second person, present tense, contractions allowed. No emoji, no exclamation marks.
6. Tense follows state. Never use past tense for anything the backend has not confirmed.

### Tense follows state
| State | Form | Example |
| :--- | :--- | :--- |
| **Suggested** | "I can..." | I can add a 45-minute mock interview on Thursday. |
| **Awaiting confirmation** | "This will..." | This will add 1 task and shorten Day 1 to 40 minutes. |
| **Running** | Present participle | Adding the mock interview... |
| **Completed** | Past tense, only after backend success | Added Mock interview to Thursday. |
| **Failed** | Plain cause, then the outcome | Couldn't save the plan. Nothing was changed. |

### Microcopy library
| Moment | Copy |
| :--- | :--- |
| **Welcome headline** | What do you want to get done? |
| **Welcome support line** | Tell me the goal and how much time you have. I'll build the plan. |
| **Composer placeholder** | Say it or type it... |
| **Empty saved plans** | No saved plans yet. Ask for one, then save it here. |
| **Network lost** | Connection lost. Your conversation is safe. Retry when you're back online. |
| **Invalid AI output** | That plan didn't come through right. Try again, or rephrase your request. |
| **Unsupported request** | I can't do that yet. I can plan, edit tasks, and track progress. |
| **Delete confirmation** | Delete Interview prep? Its tasks will be removed. This can't be undone. Buttons: Delete plan, Keep plan. |

**Do and don't**: Do: *"Moved your mock interview to Thursday."* Don't: *"Awesome! I've totally rearranged everything for you!"*

---

## 3. Logo
The Daybridge mark is an arch with a dot beneath it: a bridge, and a point of arrival. It holds up at 16 px and works in one color.

### Construction (32 x 32 grid)
The arch is a stroke of 4 with round caps: piers at x=6 and x=26 running from y=27 up to y=16, joined by a semicircle of radius 10. The dot has radius 3 and sits at the center, y=21. Keep at least 5 units between the dot and each pier.

```xml
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 27V16a10 10 0 0 1 20 0v11" stroke="#12161B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="16" cy="21" r="3" fill="#0F6F6B"/>
</svg>
```

- **Wordmark**: "daybridge" in lowercase, Geist SemiBold, tracking -3%. The mark sits left of the wordmark, optically centered on the x-height.

| Variant | Colors | Use |
| :--- | :--- | :--- |
| **Primary lockup** | Arch Gray 900, dot Harbor 600 | Header, marketing, demo video title card |
| **Mark only** | Same as lockup | Favicon, small placements |
| **Dark surface** | Arch Gray 50, dot Harbor 400 | Dark theme, video end card |
| **Mono** | One color, Gray 900 or white | Single-color print, watermarks |
| **App icon** | White arch and dot on a Harbor 600 tile, tile radius 22% | PWA icon, home-screen shortcut |

- **Clear space and size**: Clear space on every side equals half the mark height. Minimum size: mark 16 px, lockup 96 px wide.
- **In product**: The mark is static. Loading is shown by PipelineTrace, never by animating the logo.
- **Don't**: Rotate or stretch the mark. Add gradients, glows, or a ring around it. Recolor the mark outside the variants above. Place it on busy imagery.

---

## 4. Color
The palette is a cool neutral scale with one accent, Harbor, a deep teal used only for action. Amber, green, and red exist only to show state. There are no gradients and no second brand color.

- **Proportion**: Neutrals about 95%, Harbor about 4%, state colors only where a state is on screen.

### Primitives
- **Gray (neutral)**: 0 `#FFFFFF` / 50 `#F7F8F9` / 100 `#F0F2F4` / 200 `#E3E6EA` / 300 `#CDD2D8` / 400 `#9AA2AB` / 500 `#5F6873` / 600 `#4B5560` / 700 `#2B323A` / 800 `#1C2229` / 900 `#12161B` / 950 `#0B0E11` / Edge-L `#858E99` / Edge-D `#667280` (border.strong only, meets 3:1)
- **Harbor (accent)**: 50 `#EEF8F7` / 100 `#DDF1EF` / 300 `#7FCBC5` / 400 `#4FC2BB` / 600 `#0F6F6B` / 700 `#0B5956` / 900 `#063533`
- **Amber (state only)**: 100 `#FDF0DA` / 400 `#F5B24D` / 500 `#F2A33A` / 700 `#8A5300`
- **Green (state only)**: 100 `#E3F4EA` / 400 `#5FCB92` / 600 `#1F7A4D`
- **Red (state only)**: 100 `#FBE9E7` / 400 `#FF8A80` / 600 `#B3261E`

### Semantic roles
| Token | Light | Dark | Use |
| :--- | :--- | :--- | :--- |
| `bg.canvas` | Gray 50 (`#F7F8F9`) | Gray 950 (`#0B0E11`) | App background |
| `bg.surface` | White (`#FFFFFF`) | Gray 900 (`#12161B`) | Panels, cards, composer |
| `bg.raised` | White (`#FFFFFF`) | Gray 800 (`#1C2229`) | Menus, popovers, dialogs |
| `bg.sunken` | Gray 100 (`#F0F2F4`) | Gray 800 (`#1C2229`) | Inputs, user messages, wells |
| `border.default` | Gray 200 (`#E3E6EA`) | Gray 700 (`#2B323A`) | Dividers, card borders |
| `border.strong` | Edge-L (`#858E99`) | Edge-D (`#667280`) | Input borders, hover borders |
| `text.primary` | Gray 900 (`#12161B`) | Gray 50 (`#F7F8F9`) | Body, titles |
| `text.secondary` | Gray 600 (`#4B5560`) | Gray 300 (`#CDD2D8`) | Supporting text |
| `text.tertiary` | Gray 500 (`#5F6873`) | Gray 400 (`#9AA2AB`) | Captions, placeholders |
| `action.primary` | Harbor 600 (`#0F6F6B`), white text | Harbor 400 (`#4FC2BB`), Gray 950 text | Primary buttons, links, focus ring |
| `action.primary-hover` | Harbor 700 (`#0B5956`) | Harbor 300 (`#7FCBC5`) | Hover and pressed |

### Action states
Every state pairs color with an icon and a label, so color is never the only signal.

| State | Light bg / border / text | Dark bg / border / text |
| :--- | :--- | :--- |
| **Suggested** | `#EEF8F7` / `#7FCBC5` / `#0B5956` | `#112624` / `#1E5F5B` / `#7FDDD6` |
| **Awaiting confirmation** | `#FDF0DA` / `#F2A33A` / `#8A5300` | `#2B2113` / `#7A5A22` / `#F5B24D` |
| **Running** | `#F0F2F4` / `#E3E6EA` / `#4B5560` | `#1C2229` / `#2B323A` / `#CDD2D8` |
| **Completed** | `#E3F4EA` / `#8CCBA9` / `#1F7A4D` | `#10261B` / `#2E6B4A` / `#5FCB92` |
| **Failed** | `#FBE9E7` / `#E8A29C` / `#B3261E` | `#2C1513` / `#8A3A34` / `#FF8A80` |

### Contrast rules
Body text 4.5:1 minimum, large text and UI borders 3:1. Computed with the WCAG formula on 22 Oct 2026:
- text.primary on surface 18.2:1
- text.secondary 7.6:1
- text.tertiary 5.7:1 (5.0:1 on sunken)
- white on Harbor 600 6.0:1
- state tags 4.7:1 or higher in light and 7.5:1 or higher in dark
- border.strong 3.3:1 in light and 3.7:1 in dark
- Amber 500 is never text on a light surface; use Amber 700.
Re-run the check after any palette change, and verify rendered pairs with axe.

---

## 5. Typography
One family does the work. **Geist** is a precise, neutral sans with a matching mono, both free on Google Fonts. Hierarchy comes from size, weight, and spacing, not from a second typeface.

| Role | Family | Why |
| :--- | :--- | :--- |
| Display, UI, body | Geist 400, 500, 600 | One clean sans across the product, strong at small sizes |
| Data | Geist Mono 500 | Durations, dates, tool names in chips only |

### Type scale
| Token | Family and weight | Desktop size / line | Mobile size / line | Use |
| :--- | :--- | :--- | :--- | :--- |
| `display` | Geist 600, tracking -0.02em | 32 / 40 | 28 / 36 | Welcome headline |
| `h1` | Geist 600, tracking -0.02em | 24 / 32 | 22 / 30 | Screen titles |
| `h2` | Geist 600 | 18 / 26 | 18 / 26 | Plan titles, panel headers |
| `h3` | Geist 600 | 15 / 22 | 15 / 22 | Card titles, task groups |
| `body-lg` | Geist 400 | 16 / 26 | 16 / 26 | Chat messages, composer |
| `body` | Geist 400 | 14 / 22 | 14 / 22 | Task descriptions, supporting text |
| `label` | Geist 500 | 13 / 18 | 13 / 18 | Buttons, chips, tabs |
| `caption` | Geist 400 | 12 / 16 | 12 / 16 | Timestamps, hints |
| `data` | Geist Mono 500 | 12 / 16 | 12 / 16 | 45 min, Fri 24 Oct |

### Rules
- Chat text and every input stay at 16 px, which also stops iOS from zooming on focus.
- Keep message lines to 60 to 72 characters, which the 720 px chat column enforces.
- Sentence case everywhere. No all-caps labels.
- Use `font-variant-numeric: tabular-nums` on progress counts such as 3 of 7.
- Weights are 400, 500, 600 only. Negative tracking only at 24 px and above.

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@500&display=swap');

:root {
  --font-ui: 'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, Menlo, monospace;
}
```

---

## 6. Iconography, illustration and motion
Icons stay quiet, there is no illustration, and motion exists only to show that state changed. Layout, behavior, and component anatomy are specified in `design/EXPERIENCE.md`.

- **Icons**: Use Lucide: outline, 1.75 stroke, round caps, 20 px default (16 compact, 24 large), color inherited from text. No filled icons, and no sparkle icon for AI.

| Meaning | Lucide icon |
| :--- | :--- |
| Suggested | `lightbulb` |
| Awaiting confirmation | `circle-dashed` |
| Running | `loader-circle` |
| Completed | `circle-check` |
| Failed | `circle-x` |
| Dismissed | `circle-minus` |
| Voice input, send | `mic`, `arrow-up` |
| Edit, delete, retry | `pencil`, `trash-2`, `rotate-ccw` |
| Due date, time estimate, priority | `calendar`, `clock`, `flag` |
| Offline | `wifi-off` |

- **Illustration**: None. Empty and welcome states use type and space only.

### Motion tokens
| Token | Value | Use |
| :--- | :--- | :--- |
| `duration.fast` | 120 ms | Hover, toggles, button press |
| `duration.base` | 200 ms | Cards, chips, bubbles, row expansion |
| `duration.slow` | 320 ms | Panels, sheets, drawers, plan arrival |
| `duration.fade` | 1200 ms | Highlight fade on changed rows |
| `ease.standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most transitions |
| `ease.enter` | `cubic-bezier(0, 0, 0, 1)` | Things arriving |
| `ease.exit` | `cubic-bezier(0.3, 0, 1, 1)` | Things leaving |

### Interaction feedback
| Moment | Feedback |
| :--- | :--- |
| **Message sent** | Bubble fades in and rises 8 px (base), composer clears |
| **Assistant working** | PipelineTrace stages advance with real events. The logo stays static |
| **Plan arrives** | Text and plan card fade up 8 px together (slow). No stagger |
| **Suggested to awaiting** | Tag cross-fades, diff expands (base) |
| **Confirm pressed** | Card locks, tag shows Updating, buttons removed (fast) |
| **Completed** | Tag cross-fades to Plan updated, changed rows in the panel highlight and fade (fade) |
| **Failed** | Border turns red and the plain-language cause appears (base). No shake |
| **Task checked** | Box fills (fast), text strikes through, progress bar eases (base) |
| **Plan reaches 100%** | Bar turns green. No other effect. No confetti |
| **Mobile sheet opens** | Slides up with ease.enter (slow) |

- **Reduced motion**: Under `prefers-reduced-motion`, replace movement with opacity fades of 120 ms or less, stop pulses and shakes, and keep the color and text changes so state is still clear.

---

## 7. Design tokens
Tokens come in three tiers, and components may only consume the middle one. Primitives hold raw values, semantic tokens hold roles, and component tokens hold overrides. Changing a theme means remapping semantic tokens, never editing components.

- **Naming**: `category-role-variant-state`, for example `color-action-primary-hover`. Delivered as CSS custom properties, with a `data-theme` attribute for light and dark. The first load follows the system setting.

| Token group | Values |
| :--- | :--- |
| `space` (4 px base) | 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 as space-0 to space-16 |
| `radius` | sm 4 (chips, checkboxes), md 6 (buttons, inputs), lg 8 (cards), xl 12 (composer, dialogs, bubbles, sheets), pill 999 (progress bar ends only) |
| `elevation` | e0 none (border only, the default), e2 0 8px 24px rgba(11,14,17,0.12) for menus, drawers, sheets, dialogs, toasts only |
| `breakpoint` | sm 0 to 639, md 640 to 1023, lg 1024 to 1279, xl 1280 and up |
| `gutter` | 16 mobile, 24 tablet and desktop |
| `layout width` | Chat column max 680, plan panel 440 (400 at lg), saved-plans rail 264, header 56 |
| `z-index` | base 0, sticky 10, overlay 20, drawer and sheet 30, dialog 40, toast 50 |
| `control height` | 36 desktop, 44 touch. Icons 20, 16 in chips |
| `focus ring` | 2 px Harbor, 2 px offset, always visible on keyboard focus |

In dark theme, elevation switches from shadow to a lighter surface plus a border, with shadows at `rgba(0,0,0,0.4)` for sheets only.

```css
:root {
  --color-bg-canvas: #F7F8F9;
  --color-bg-surface: #FFFFFF;
  --color-bg-raised: #FFFFFF;
  --color-bg-sunken: #F0F2F4;
  --color-border-default: #E3E6EA;
  --color-border-strong: #858E99;
  --color-text-primary: #12161B;
  --color-text-secondary: #4B5560;
  --color-text-tertiary: #5F6873;
  --color-action-primary: #0F6F6B;
  --color-action-primary-hover: #0B5956;
  --color-action-on-primary: #FFFFFF;
  --color-focus-ring: #0F6F6B;

  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-pill: 999px;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0, 0, 0, 1);
  --ease-exit: cubic-bezier(0.3, 0, 1, 1);

  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 320ms;
  --duration-fade: 1200ms;
}

[data-theme='dark'] {
  --color-bg-canvas: #0B0E11;
  --color-bg-surface: #12161B;
  --color-bg-raised: #1C2229;
  --color-bg-sunken: #1C2229;
  --color-border-default: #2B323A;
  --color-border-strong: #667280;
  --color-text-primary: #F7F8F9;
  --color-text-secondary: #CDD2D8;
  --color-text-tertiary: #9AA2AB;
  --color-action-primary: #4FC2BB;
  --color-action-primary-hover: #7FCBC5;
  --color-action-on-primary: #0B0E11;
  --color-focus-ring: #4FC2BB;
}
```

This block is the seed. The build step generates the full set, including the five action-state triples, from the tables in sections 4 to 6.

---

## 8. Component library
Twenty components cover every screen in the PRD. Layout and anatomy details live in `design/EXPERIENCE.md`, which wins on layout and behavior. The action card is the hero, because it carries the PRD's core distinction between suggested, awaiting confirmation, and completed.

| Component | Job | Key specs and states |
| :--- | :--- | :--- |
| **AppShell** | Layout frame | Desktop: saved-plans rail 264, chat, plan panel 440. Mobile: single column, Plans as a pushed screen, plan as a bottom sheet |
| **ChatThread** | Conversation | 720 max width, scrolls to latest, keeps all content on errors, live region announces new assistant messages |
| **MessageBubble** | One message | User: sunken bubble, right-aligned, 80% max. Assistant: no bubble, 20 px brand mark in a 32 px gutter. Interactive elements never sit inside message text |
| **Composer** | Input | 56 min height, grows to 5 lines, mic and send. Enter sends, Shift+Enter breaks. States: idle, typing, listening, sending, disabled. Sticks above the safe area |
| **PromptChip** | Suggested prompts | Full-width row, 44 high, tap fills the composer and focuses it |
| **PipelineTrace** | The Alexa+-style cue | Heard, Understood, Planning, Ready, plus a tool-name chip such as create_plan in the data font. Collapses to one line when done, failed stage marked red |
| **ActionCard** | Suggest, confirm, report | Six states, detailed below |
| **PlanCard** | Plan inside chat | Title, objective, first 3 tasks plus "+n more", total time, status chip Suggested or Saved, actions Save plan and Open |
| **PlanPanel** | Full plan view | Editable title, progress ring, objective, tasks grouped by day, add task, overflow menu with Delete plan |
| **TaskRow** | One task | 56 min height, 24 px checkbox with 44 px hit area, title, 2-line description, chips. States: default, hover, editing, saving, done, error |
| **TaskEditor** | Inline edit | Title, description, priority select, date picker, Save and Cancel. Row-level error with Retry |
| **DiffRow** | One proposed change | Added (plus, green), Changed (old struck, new shown), Removed (minus, red). Always labeled in text |
| **Chip** | Metadata | Priority (flag, High, Medium, Low), due date (calendar, data font), estimate (clock, data font). 22 high, radius 4 |
| **ProgressBar and Ring** | Progress | Bar 8 high with pill ends, ring 40, tabular "3 of 7", Green at 100% |
| **SavedPlanItem** | List entry | Title, bar, "3 of 7 tasks", updated time. States: default, hover, selected |
| **ConfirmDialog** | Destructive actions | Names the object and consequence, initial focus on the safe button, Esc cancels, destructive button in Red |
| **Banner and Toast** | Feedback | Banner stays in the thread for errors with Retry. Toast lasts 4 s for small successes. role alert or status |
| **EmptyState** | Welcome and empty lists | Display type, support line, composer, three prompt rows |
| **Skeleton** | Loading | Plan-card and list skeletons, static blocks, no shimmer |
| **Button** | Actions | Primary, secondary, ghost, destructive. 44 and 36 high, radius md. States: default, hover, pressed, focus, disabled, loading |

### Action card states
The card is the visible form of the PRD rule that suggested, pending, and finished actions must look different.
Suggested actions go to confirmation or are dismissed. Only a successful backend response reaches Completed, and failures return through retry or close.

| State | What the card shows | Actions |
| :--- | :--- | :--- |
| **Suggested** | lightbulb, an "I can..." sentence, one-line summary | Review, Dismiss |
| **Awaiting confirmation** | circle-dashed, a "This will..." sentence, DiffRows listing every change | Confirm, Cancel |
| **Running** | loader-circle, "Adding...", card locked | None |
| **Completed** | circle-check, past-tense summary of what changed, timestamp | View plan |
| **Failed** | circle-x, plain cause, "Nothing was changed" or exactly what was | Retry, Close |
| **Dismissed** | circle-minus, one muted line | None |

#### Rules
1. Completed renders only from a successful structured backend response. No response, no Completed.
2. AI-initiated changes never apply optimistically. They always pass through Awaiting confirmation.
3. User-initiated toggles, such as ticking a task, may update optimistically and must roll back with an error message on failure.
4. Deleting a plan always opens ConfirmDialog, whoever asked.
5. A failed card never removes the conversation or the user's edits.

---

## 9. Screens, responsive behavior and accessibility
The frame set below covers all seven PRD design deliverables. Design mobile (390 x 844) first, then desktop (1440 x 900).

### Frame set mapped to the PRD
| PRD deliverable | Frames | Hero components |
| :--- | :--- | :--- |
| **1. Welcome and empty state** | Welcome, welcome with voice listening | EmptyState, PromptChip, Composer |
| **2. Active conversation** | Conversation while running, conversation after reply | ChatThread, MessageBubble, PipelineTrace |
| **3. Response with a plan** | Plan card suggested (unsaved), plan card saved | PlanCard |
| **4. Task editing and completion** | Plan panel, task editing, task completed with progress, follow-up awaiting confirmation with diff, follow-up completed | PlanPanel, TaskRow, TaskEditor, DiffRow, ActionCard |
| **5. Saved plans and progress** | Saved plans list, empty list, delete confirmation | SavedPlanItem, ProgressBar, ConfirmDialog |
| **6. Loading, error, success** | Plan skeleton, AI failure, invalid AI output, offline, save failed, action failed, success toast | Skeleton, Banner, Toast, ActionCard |
| **7. Responsive** | Desktop three-pane, tablet two-pane, mobile chat, Plans tab and plan sheet | AppShell |

### Figma file structure
Pages: 00 Cover, 01 Foundations, 02 Components, 03 Screens Mobile, 04 Screens Desktop, 05 Prototype, 06 Handoff. Variables for color, space, radius, and type mirror the token names in section 7, with Light and Dark modes. Components use properties for state, size, and type.

### Responsive behavior
| Breakpoint | Layout |
| :--- | :--- |
| **sm**, under 640 | Single column. Top bar with Plans (count badge) and New plan buttons, no bottom tabs. Plans is a pushed screen. Open on a PlanCard raises the plan as a full-height sheet with a grab handle. Composer sticks above the safe area |
| **md**, 640 to 1023 | Single column, 680 chat. Plans in a 320 left drawer, plan in a 440 right drawer over a scrim |
| **lg**, 1024 to 1279 | Chat plus a pinned plan panel of 400. Plans in a left drawer |
| **xl**, 1280 and up | Three panes: saved-plans rail 264, chat, plan panel 440. Record the demo at 1440 |

- **The 30-second test**: The welcome frame must state the promise, show the composer, and offer three prompt chips, so a judge understands the product before typing anything.

### Accessibility
- Contrast meets AA, focus ring is always visible, every target is at least 44 x 44.
- Keyboard: Enter sends, Shift+Enter breaks a line, Esc closes sheets and dialogs, Space toggles a task, Enter saves an inline edit and Esc cancels it.
- Screen readers: ChatThread is a log with polite announcements. Action state changes announce through role status, failures through role alert. Progress uses the progressbar role with values. PipelineTrace is an ordered list with aria-current on the active step.
- State is never color alone. Every state has an icon and a text label.
- Voice input feature-detects the Web Speech API, hides the mic when unsupported, and always leaves the text path open.
- Text resizes to 200% without loss, and both themes are checked.

---

## 10. Antigravity workflow
The design system reaches Antigravity as three layers: rules that always apply, skills that run as slash commands, and one kickoff prompt that drives them in order with a review gate after each. A lone design.md gives the agent a spec but no process and no proof. This adds both.

*Platform note, checked 21 October 2026*: Antigravity's docs say legacy workflow files stop working on 19 October 2026 and point to skills instead, so this kit uses skills. A skill lives at `.agents/skills/<name>/SKILL.md` and runs as `/<name>`. Rules live flat in `.agents/rules/`, and every rule file must open with YAML frontmatter and a valid trigger (`always_on`, `model_decision`, `glob`, or `manual`), otherwise Antigravity drops it silently. A rule file is capped at 24 KB. The same files work in the App, CLI, and IDE.

### The kit
| Layer | File | Activation | Job |
| :--- | :--- | :--- | :--- |
| **Context** | `AGENTS.md` | Always on | Product context, sprint priorities, sources of truth, skill order |
| **Spec** | `design/EXPERIENCE.md` | Referenced by rules and skills | Wireframes, exact sizes, flows, voice, copy, timings, QA checklist |
| **Spec** | `design/API_CONTRACT.md` | Referenced by rules and skills | Endpoints, schemas, errors, confirm-before-write protocol |
| **Rule** | `.agents/rules/design-system.md` | Glob on frontend UI files | Follow wireframes, tokens only, flat and hairline, banned patterns |
| **Rule** | `.agents/rules/truthful-state.md` | Model decision | Completed only from confirmed backend success |
| **Skill** | `/ds-tokens` | Slash or automatic | tokens.json, tokens.css, fonts, ThemeProvider, token page |
| **Skill** | `/ds-slice` | Slash or automatic | The hero path end to end on the mock, where the look is decided |
| **Skill** | `/ds-connect` | Slash or automatic | Real backend, voice, deploy config, smoke test |
| **Skill** | `/ds-audit` | Slash or automatic | Screenshots, visual checklist, axe, lint, fix loop (scope: hero path) |
| **Skill, post-sprint** | `/ds-components`, `/ds-screens`, `/ds-handoff` | Only when asked | Full library, every frame and breakpoint, handoff files |

```
daybridge/
├── AGENTS.md
├── .agents/
│   ├── rules/
│   │   ├── design-system.md
│   │   └── truthful-state.md
│   └── skills/
│       ├── ds-tokens/SKILL.md
│       ├── ds-slice/SKILL.md
│       ├── ds-connect/SKILL.md
│       ├── ds-audit/SKILL.md
│       ├── ds-components/SKILL.md (post-sprint)
│       ├── ds-screens/SKILL.md (post-sprint)
│       └── ds-handoff/SKILL.md (post-sprint)
├── design/
│   ├── DESIGN.md (this doc, exported as Markdown)
│   ├── EXPERIENCE.md (screen and flow blueprint)
│   ├── API_CONTRACT.md (frontend and backend contract)
│   ├── KICKOFF.md (the prompt to paste)
│   ├── tokens.json (generated by /ds-tokens)
│   └── audit/ (screenshots and REPORT.md from /ds-audit)
└── frontend/ (React, TypeScript, Vite)
```

### Gates
Each phase ends with a review artifact, and the agent waits for your "approved".

| Phase | Skill | Time box | Artifact you review |
| :--- | :--- | :--- | :--- |
| **1** | `/ds-tokens` | 30 min | Token summary, light and dark swatch page, contrast failures |
| **2** | `/ds-slice` | 3 h | The hero path, clickable on the mock, with section 11 checklist results. The most important gate |
| **3** | `/ds-connect` | 2 h | Smoke test results, recording on the real backend with voice and the failure drill, contract mismatches |
| **4** | `/ds-audit (hero path)` | 1 h | REPORT.md with zero serious or critical violations |

### Setup
1. Unzip the kit at the repo root so `AGENTS.md`, `.agents/`, and `design/` sit beside `frontend/`. Adjust paths if your frontend folder has another name.
2. Export this doc as Markdown and save it as `design/DESIGN.md`. `EXPERIENCE.md` is already in the kit.
3. Open the repo in Antigravity. In Customizations, confirm 2 rules and 7 skills are listed. A missing rule means its frontmatter is invalid.
4. Paste `design/KICKOFF.md` into the agent.
5. At each gate, review the artifact, then reply "approved" or give corrections. If the `/ds-slice` path does not look right, fix it there before anything else is built.

### Kickoff prompt
```markdown
You are the lead UI engineer for Daybridge, an AI planning assistant (React, TypeScript, Vite; Flask backend built separately by another engineer). This is a hackathon sprint: the hero path must be flawless and beautiful, and breadth comes second. Build the front end exactly as specified in @design/EXPERIENCE.md (screens, behavior, voice, anatomy), @design/DESIGN.md (brand and token values), and @design/API_CONTRACT.md (data shapes). Use a mock that implements the contract until the backend is ready. No backend features, no real AI calls. The bar is a premium, production-grade product: calm, precise, flat, hairline, document-like. It must not look like a generated chatbot template. Read EXPERIENCE.md section 1 and the banned list before writing any UI. Read AGENTS.md. Confirm the 2 rules and 7 skills are loaded. Then run /ds-tokens, /ds-slice, /ds-connect, and /ds-audit with scope "hero path", in order. After each, stop, publish a review artifact with screenshots at 1440 and 390 in light and dark, the section 11 checklist results, deviations, and open questions, and wait for me to reply "approved". Build each screen from its wireframe literally. No wireframe means stop and ask. Do not write new copy.
```
*(The full version, with hard rules, time boxes, and the definition of done, is `design/KICKOFF.md` in the kit.)*

- **Mid-flight commands**: Run `/ds-components` chat components only to scope a pass. Run `/ds-audit` after any UI change. Run `/ds-tokens` again after editing sections 4 to 7 of DESIGN.md.
- **Scope**: This workflow produces the front-end design system and mock-data screens only. Wiring to the Flask endpoints is a separate step, and `/ds-handoff` prepares the type contracts for it.
