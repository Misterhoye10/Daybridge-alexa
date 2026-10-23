# Design-frontend audit — Daybridge — 2026-10-23

**Mode:** C Design-to-Code (partial — `EXPERIENCE.md` missing; DESIGN + API + live UI + screenshot used)  
**Inputs inspected:** `design/DESIGN.md`, `design/KICKOFF.md`, `design/ROADMAP.md`, `API_CONTRACT.md`, `design/audit/REPORT.md`, `frontend/src/**`, `backend/**`, live https://daybridge-alexa.vercel.app, empty-state screenshot  
**Not inspected:** Figma file, real Render logs, device lab, screen reader session recording  
**Routed reports:** `build-readiness.md`, `production-audit.md`

**Overall status:** Prototype Ready (hackathon) / **Not** Production Ready  
**Verdict:** Do not ship (as production). Ship after fixes only as **demo** if P0 truthful-state + mock gating are accepted as known debt.

---

## Executive summary

The empty first-run screenshot matches the intended **welcome + empty canvas** composition from DESIGN microcopy. Visual system (Harbor, Geist, hairlines, arch mark) largely holds. The product is **not** production-ready: the brand’s core differentiator — *honest action / tense follows state* — is violated in code; API failures silently become a local simulator; the experience PRD (`EXPERIENCE.md`) is absent; the existing `/ds-audit` REPORT over-states compliance.

Screenshot note: source copy is `Tell me the goal…` (correct). “goa.” in the capture is almost certainly **glyph clipping / overlay**, not a string typo. Yellow sparkle widgets in the capture are **not** found in the live DOM text dump — treat as external chrome unless reproduced in a clean browser profile.

### Core answers

1. **What breaks first at 1,000 users?** Backend latency or outage → silent mock “success”; users save/act on plans that never hit the server; confirm UI lies.  
2. **Smallest fix set?** (a) Gate mock behind explicit demo flag, (b) Confirm → `confirmAction` only then `completed`, (c) 30s timeout + DESIGN error copy, (d) fix empty-plan copy.

---

## Critical findings (P0 / P1)

### [P0] — Truthful state violated
**Area:** Confirm / chat action cards  
**Class:** IMPLEMENTATION (+ PRODUCT prompt in Gemini)  
**Evidence:** `App.tsx` `handleApplyAction` sets `completed` locally; `api.ts` create_plan mock returns `state: 'completed'` + past tense; `gemini_agent.py` SYSTEM_PROMPT rule 1 forces CREATE_PLAN completed.  
**Problem:** DESIGN §2 + AGENTS: past tense only after backend success.  
**Impact:** Brand promise false; enterprise “honesty” demo fails under scrutiny.  
**Recommendation:** Wire Confirm to `POST /api/actions/:id/confirm`; running state while pending; failed + retry on error.  
**Verification:** Fail drill 503 → no green Completed.

### [P0] — Silent mock fallback
**Area:** `frontend/src/services/api.ts` `tryFetch`  
**Class:** SYSTEM  
**Evidence:** 2500ms abort; catch → null → simulated interview plan.  
**Problem:** Contract §1 truthful failure + 30s.  
**Impact:** Production looks “fine” while AI never runs.  
**Recommendation:** Prod: no fallback. Dev: `VITE_USE_MOCK=1`.  
**Verification:** Kill API → “Connection lost…” not fake plan.

### [P1] — Empty canvas uses wrong empty type
**Area:** PlanCanvas `!plan`  
**Class:** DESIGN/IMPLEMENTATION  
**Evidence:** Screenshot + `PlanCanvas.tsx` “No saved plans yet. Ask for one, then save it here.” after New plan (active plan cleared; library may still be empty for other reasons). DESIGN empty line is for **saved library**, not active canvas after reset.  
**Problem:** Conflates first-use active empty with library empty (#3, empty-state anatomy).  
**Impact:** User unsure whether to chat or open Saved plans.  
**Recommendation:** Active empty: “No plan open. Ask on the left — I’ll build one here.” + optional CTA focusing composer. Library empty stays DESIGN string. Use `EmptyState` primitive.

### [P1] — EXPERIENCE.md missing
**Area:** Spec  
**Class:** PRODUCT  
**Evidence:** DESIGN/KICKOFF reference `design/EXPERIENCE.md`; `Test-Path` → False.  
**Problem:** Wireframes/QA checklist source of truth gone.  
**Impact:** Cannot Mode-C verify layout anatomy; prior audit unverifiable.  
**Recommendation:** Restore from author kit or regenerate from live + DESIGN § screens.

### [P1] — Prior ds-audit false PASS
**Area:** `design/audit/REPORT.md`  
**Class:** SYSTEM  
**Evidence:** Claims 0 violations / no sparkle; repo still has AlexaOrb Sparkles + gradients + emoji tasks.  
**Problem:** Audit not grounded in current tree.  
**Impact:** False ship confidence.  
**Recommendation:** Re-run `/ds-audit` after cleanup; treat old REPORT as stale.

---

## Important findings (P2)

| ID | Class | Finding | Fix |
|---|---|---|---|
| DF-06 | IMPLEMENTATION | Icon-only Theme / Palette / Reset — `title` only, weak a11y (#11) | `aria-label`, 44px hit |
| DF-07 | IMPLEMENTATION | New plan and Reset both call `handleResetSession` | Differentiate or remove duplicate |
| DF-08 | IMPLEMENTATION | Design-system entry in prod chrome | Hide behind `?design` or env |
| DF-09 | DESIGN | EmptyState primitive unused on canvas | Adopt component |
| DF-10 | IMPLEMENTATION | Task CRUD not persisted | PATCH tasks |
| DF-11 | PRODUCT | ROADMAP items (TTS, .ics, fail drill UI) still open | Explicit demo scope cut |

## Improvements (P3)

- Skeleton gradient shimmer borders banned “gradients” spirit — prefer opacity pulse under reduced-motion.  
- Density: header control cluster competes with New plan (#2).  
- Board/Timeline dual view: document in IA or cut for hero focus.

---

## Mode C — Design vs implementation

| Screen / component | Design (DESIGN.md) | Implementation | Match? | Class |
|---|---|---|---|---|
| Welcome headline | “What do you want to get done?” | Same | Yes | — |
| Welcome support | goal + time copy | Same in source | Yes (clip in screenshot UNKNOWN) | UNKNOWN |
| Empty saved plans | Ask for one, then save | Used on **null plan** canvas | Drift | IMPLEMENTATION |
| Composer placeholder | Say it or type it… | Present (+ shortcut hint) | Mostly | — |
| No sparkle / glow / cyan / purple | Banned | AlexaOrb contains all | Drift (dead?) | IMPLEMENTATION |
| No emoji | Banned | `categoryEmoji` in mock | Drift | IMPLEMENTATION |
| Truthful completed | After backend | Before / without confirm | Fail | IMPLEMENTATION |
| PipelineTrace for loading | Not logo spin | PipelineTrace exists | Partial | — |
| Action states palette | 5 states | ActionCard themes present | Partial (wire incomplete) | — |
| EXPERIENCE wireframes | Required | File missing | Missing | PRODUCT |

Design-only (not built): EXPERIENCE screens unknown; offline banner; fail-drill navbar (ROADMAP).  
Code-only: AlexaOrb, design-token page in header, board kanban extras, emoji categories.

---

## Dimension notes

| # | Dimension | Status | Evidence |
|---|---|---|---|
| 01 | Product/UX | Partial | Strong JTBD; confirm honesty fail |
| 02 | Visual UI | Strong | Tokens, Harbor, mark |
| 03 | Hierarchy | Pass | Welcome primary; New plan strong |
| 04 | States | Fail | Truth + empty type |
| 05 | A11y | Concern | Partial ARIA; icon meat |
| 06 | Responsive | Concern | Strategy only |
| 07 | API/resilience | Fail | Mock |
| 08 | Security | Fail | Session/CORS |
| 09 | Consistency vs DS | Concern | Dead banned orb |
| 10 | First-run | Concern | Empty copy; no onboarding.md |

---

## Scorecard (/10)

| Dimension | Score |
| --- | ---: |
| Visual craft | 8 |
| Brand compliance | 5 |
| UX clarity | 6 |
| State completeness | 3 |
| Accessibility | 5 |
| Implementation correctness | 3 |
| Production resilience | 2 |
| Spec completeness | 3 |

---

## Top 5 actions

1. Gate mock; honest errors (P0).  
2. Confirm → API → then Completed (P0).  
3. Fix active-plan empty copy + EmptyState CTA (P1).  
4. Restore EXPERIENCE.md; invalidate stale ds-audit (P1).  
5. Delete AlexaOrb; strip emoji; aria-label header icons (P2).

---

## Production verdict

**Do not ship** as a production personal assistant.

**Why:** The UI looks launchable; the system lies under failure and completes actions without confirmed writes — exactly what Daybridge claims not to do.

Hackathon submission can proceed **only** if demo script discloses simulation mode or backend is proven live end-to-end without mock fallback.

## Follow-ups

| Next | Command |
|---|---|
| Fix P0s in code | `/ai-product-production` Implement |
| System gate (done) | `build-readiness.md` |
| A11y depth | `/a11y-audit` |
| Empty / first-run | `/empty-states`, `/onboarding` |
| Re-audit tokens | Daybridge `/ds-audit` |
