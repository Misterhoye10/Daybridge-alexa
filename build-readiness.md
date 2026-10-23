# Build-readiness — Daybridge — 2026-10-23

**Verdict:** Ready with conditions  
**P0 patch (2026-10-23):** Mock gated behind `VITE_USE_MOCK=1`; Confirm → `confirmAction` → completed/failed; active-plan empty copy fixed; `EXPERIENCE.md` restored; Gemini create = draft + present tense. Remaining: live E2E against Render without mock, CORS/secrets lock, task persist, FE tests.  
**Sources:** `design/DESIGN.md`, `design/KICKOFF.md`, `design/ROADMAP.md`, `API_CONTRACT.md`, `design/audit/REPORT.md`, live [daybridge-alexa.vercel.app](https://daybridge-alexa.vercel.app), frontend + backend codebase, screenshot of empty first-run  
**Artifact map:**

| Artifact | Status |
|---|---|
| Brand / tokens (`DESIGN.md`, `tokens.css`) | Exists |
| Experience / PRD wireframes (`EXPERIENCE.md`) | **Missing** (referenced everywhere) |
| API contract | Exists; frontend + backend drift |
| Flows / IA / personas / states pack | Missing as Talo files |
| Prior `/ds-audit` report | Exists — **over-claims PASS** vs code evidence |
| Deploy configs (Vercel / Render) | Exists |

**Top P0–P1 (ranked):**
1. **P0 — Truthful state broken.** Past tense / `completed` rendered without confirmed write (`handleApplyAction`, mock chat, Gemini prompt CREATE_PLAN → completed).
2. **P0 — Silent mock fallback.** `tryFetch` 2.5s timeout + swallow errors → fake success when API is slow/down (contract requires 30s + honest failure).
3. **P1 — Missing `EXPERIENCE.md`.** Layout/behavior source of truth absent; cannot verify screen anatomy against PRD.
4. **P1 — Contract / test drift.** Backend journey test expects `reply` / `action.data`; contract expects `ok` / `message` / `plan`.
5. **P1 — Empty canvas copy wrong.** `!plan` shows “No saved plans yet” (library empty) after New plan (active plan empty) — conflates two jobs (#3).

**Next commands:** restore/find `EXPERIENCE.md` · wire Confirm → `confirmAction` · kill silent mock in prod · `/ai-product-production` Implement · `/a11y-audit` · `/states`

---

## 1. Product Understanding

- **Purpose:** Turn natural-language intention into a sequenced plan and truthful task progress (Alexa+-inspired interaction model, not Amazon identity).
- **ICP (assumed from brief):** Someone who knows the goal but not the sequence (e.g. interview prep under time constraints).
- **Core job:** *When I say what I want done and how much time I have, help me get a concrete plan I can confirm, track, and trust.*
- **Business:** Hackathon submission (Amazon Developer Hackathon 2026). Not a monetized product yet.
- **MVP in:** Chat → plan → confirm-before-write → task progress → save/list plans · dark/light · Harbor tokens.
- **MVP out (ROADMAP still open):** TTS, `.ics` export, failure drill UI, judge scenario selector polish.

## 2. Assumptions

| Known | Unknown / hypothesis |
|---|---|
| Brand system is documented and largely tokenized | Whether production Gemini + Postgres are wired on live deploy |
| Hero path is interview-prep demo | Whether `EXPERIENCE.md` was never committed or lost |
| No login; session via `X-Session-Id` | Multi-device / shared-session abuse tolerance for “production” |
| Frontend ships on Vercel | Backend Render uptime + CORS `*` intentionality |

## 3. User Problems

Sequencing overload; chatbot advice without executable structure; opaque “AI did something” claims. Alternatives: Notes, Calendar, ChatGPT paste → spreadsheet.

## 4. Core User Journeys

| Journey | Trigger → Success | Value | Abandon risks |
|---|---|---|---|
| Create plan from prompt | Prompt chip / composer → draft plan on canvas | Sees structure | Mock past-tense success without save |
| Confirm mutation | “Make day 1 easier…” → confirm → plan updates | Trust | Confirm is local-only today |
| Track progress | Toggle tasks → progress updates | Momentum | Toggles not persisted via API |
| Save / reopen | Save → Saved plans drawer | Continuity | Empty vs library confusion |
| First-run empty | New plan → empty canvas + welcome chat | Clear next step | Wrong empty copy; no CTA on canvas |

## 5. Information Architecture

Split studio: **Assistant (chat)** | **Plan canvas**. Header: New plan, Saved plans, theme, design-system, reset. Mobile tab switcher exists in code. No auth nav. Design-system route is judge/dev chrome in the product shell.

## 6. Screen Inventory

| Screen | Purpose | Primary action | Type |
|---|---|---|---|
| Chat welcome | Capture intention | Send / prompt chip | Empty + composer |
| Chat thread | Conversation + action cards | Confirm / dismiss | Detail |
| Plan canvas (filled) | Edit/track plan | Toggle task / save | Detail |
| Plan canvas (null) | Empty active plan | (should) Ask in chat | Empty — **copy wrong** |
| Saved plans drawer | Library | Open / delete | List + dialog |
| Token swatch | DS QA | Back | Dev |

## 7. State Matrix

| Screen | Default | Loading | Empty | Error | Success | Notes |
|---|---|---|---|---|---|---|
| Chat | ✓ | Partial (loading flag) | ✓ welcome | Partial (banner string) | Partial | Offline copy in DESIGN unused |
| Plan | ✓ seeded plan | ✗ | Wrong copy | ✗ | Local | |
| Confirm action | Partial | ✗ running | — | ✗ | Claims completed without API | **P0** |
| Saved drawer | ✓ | ✗ | Partial | ✗ | — | |

## 8. Component System

Primitives present: Button, Chip, DiffRow, EmptyState, PromptChip, Skeleton, ActionCard, PipelineTrace, Logo. **EmptyState unused** on plan null. **AlexaOrb** remains: gradients, cyan/purple, Sparkles — banned by DESIGN (§1) / AGENTS.md. Emoji via `categoryEmoji` in mock data — banned.

## 9. Responsive Strategy

Desktop split + mobile tab bar in CSS (`display: none` until breakpoint). Intentional; not fully verified in this pass on device lab.

## 10. Security & Permission Model

- No auth; session UUID in `localStorage`.
- Backend scopes by `X-Session-Id` only → guessable/forgeable session = data access (hackathon OK; production **not**).
- Default `SECRET_KEY` fallback in `config.py`.
- Render `CORS_ORIGINS: "*"` in `render.yaml`.
- Gemini key via env (good) — client must never embed it (appears server-side only).

## 11. Technical Considerations

| Change | Class |
|---|---|
| Fix confirm → `POST /api/actions/:id/confirm` | Reversible |
| Disable mock fallback when `VITE_API_URL` set | Reversible |
| Align backend response to contract | Reversible but careful |
| Add real auth | Expensive |
| Drop session-only model | Structural |

## 12. Analytics

None observed. Minimum for demo ops: `chat_sent`, `plan_created`, `action_confirmed`, `action_failed`, `plan_saved`, `api_fallback_mock` (especially).

## 13. Production Risks

- Users believe writes succeeded when mock answered.
- AI latency >2.5s always falls to mock.
- Contract vs agent schema mismatch → flaky integration.
- Prior audit “0 violations” creates false confidence.

## 14. Design Priorities

1. Restore truthful confirm/fail states (product promise).  
2. Prod API path only — no silent simulation.  
3. Fix empty-plan vs empty-library copy + use EmptyState + CTA.  
4. Recover `EXPERIENCE.md` or rewrite screen bible.  
5. Strip AlexaOrb / emoji / icon-only unlabeled controls.  

## 15. Final Audit

### Scorecard (0–5)

| Category | Score | Note |
|---|---:|---|
| Product clarity | 4 | Strong brand idea |
| UX | 3 | Hero clear; confirm/empty drift |
| Information architecture | 3 | Split works |
| UI | 4 | Tokens / Harbor mostly held |
| Interaction design | 2 | Confirm not real |
| States | 2 | Happy path heavy |
| Accessibility | 3 | Some ARIA; icon buttons weak |
| Responsiveness | 3 | Strategy present |
| Security | 1 | Session-only + CORS * |
| Technical feasibility | 3 | Feasible; contract drift |
| Reliability | 1 | Mock masks failure |
| Analytics | 0 | None |
| Business | 2 | Hackathon, not ops |
| Production readiness | 1 | Demo ≠ production |

### Issues

| ID | Pri | Category | Issue | Recommendation |
|---|---|---|---|---|
| BR-01 | P0 | Truth / #6 | Completed without backend confirm | Confirm only after 2xx `ok:true` |
| BR-02 | P0 | Reliability | Silent mock + 2.5s timeout | 30s; surface errors; mock only in `DEV_SIM=1` |
| BR-03 | P1 | Docs | `EXPERIENCE.md` missing | Restore or rewrite |
| BR-04 | P1 | States / #3 | Empty plan copy = saved library | Distinct copy + CTA |
| BR-05 | P1 | Contract | FE/BE/test schema drift | Freeze one contract; fix tests |
| BR-06 | P2 | Brand | AlexaOrb + emoji leftover | Delete / replace |
| BR-07 | P2 | A11y / #11 | Icon-only header controls | `aria-label` + visible focus |
| BR-08 | P2 | Security | CORS * / weak secret defaults | Lock origins; require secrets |

### Motion note

PipelineTrace = System-state. Confirm press = Feedback. No decorative motion required. AlexaOrb pulse/glow violates brand motion restraint.

---

## Routed follow-ups

| Missing deep work | Command / action |
|---|---|
| Engineering harden | `/ai-product-production` Implement |
| Design↔code ship gate | See `audits/design-frontend-v1-2026-10-23.md` |
| Full state pack | `/states` |
| A11y criterion pass | `/a11y-audit` |
| First-run copy | `/onboarding` + `/empty-states` |
| Trust boundary | `/frontend-trust` |
