# Production audit — Daybridge — 2026-10-23

**Mode:** Audit  
**Verdict:** Not production-ready  
**Scope:** Frontend (`frontend/`), backend (`backend/`), deploy configs, live Vercel app  
**Related:** `build-readiness.md`, `audits/design-frontend-v1-2026-10-23.md`

A prototype that demos well. Layers 6–13 are not Ready.

---

## Layer scores

| Layer | Status | Evidence |
|---|---|---|
| 1 UI / Visual | Partial | Tokens + Harbor; banned AlexaOrb + emoji data remain |
| 2 Responsive | Partial | Mobile tab bar coded; not device-lab verified here |
| 3 Accessibility | Partial | log/live, dialog Escape, progressbar; icon-only header gaps |
| 4 Interaction | Partial | Hover/press uneven; confirm path incomplete |
| 5 Application states | Partial | Welcome empty yes; offline/error/retry incomplete |
| 6 Data & API | Partial | Contract written; silent mock; 2.5s abort; schema drift |
| 7 State management | Partial | Local React state; task edits not server-owned |
| 8 Error & resilience | Not Started→Partial | Catch sets string; no boundary; mock hides failure |
| 9 Performance | Partial | Vite SPA; no measurement; AI path aborted early |
| 10 Offline / network | Not Started | DESIGN has offline copy; unused |
| 11 Security | Not Started | Session header only; CORS *; default SECRET_KEY |
| 12 Testing & observability | Not Started | No FE tests; one BE script mismatched to contract; no Sentry |
| 13 Production ops | Partial | Vercel + Render yaml; secrets sync:false; no rollback/runbook |

---

## Critical gaps

### [P0] Confirm claims completed without API write
**Problem:** `App.handleApplyAction` sets `state: 'completed'` locally; does not await `apiService.confirmAction`. Mock `sendChat` returns create_plan as already `completed` with past-tense copy (“I've structured…”). Gemini system prompt forces CREATE_PLAN → `action_status = "completed"`.  
**Impact:** Breaks brand promise (DESIGN §2 tense table, AGENTS truthful state). Users trust false success.  
**Fix:** Suggested → awaiting_confirmation → running → completed only after `ok: true`. Past tense only then.  
**Verify:** Network panel shows confirm 2xx before green badge; force 503 → Failed + Retry, no past tense.

### [P0] Silent simulation masks production API failure
**Problem:** `tryFetch` 2.5s timeout; any failure returns `null` → mock happy path. Contract: 30s timeout; never claim success on error.  
**Impact:** At 1k users / cold Gemini, everyone gets simulated plans while believing the backend ran.  
**Fix:** If `VITE_API_URL` is production, no mock. Surface `{ok:false}` / network lost copy from DESIGN. Timeout 30s. Log `api_fallback_mock` only in explicit demo mode.

### [P1] Frontend ↔ backend ↔ test contract drift
**Problem:** `API_CONTRACT.md` uses `ok`, `message`, `plan`, `action`. `test_agent.py` asserts `reply`, `action.data`. Agent JSON schema differs from frozen types.  
**Impact:** Integration “passes” in one shape and fails in another.  
**Fix:** Single OpenAPI/TS types; regenerate BE validation; rewrite journey test against contract.

### [P1] Mutations not durable
**Problem:** Task toggle/update/delete/title edit update React state only; no `PATCH /api/tasks` from UI path inspected.  
**Impact:** Refresh loses progress; multi-tab lies.  
**Fix:** Persist task mutations; optimistic UI with rollback on fail.

### [P1] Security defaults unsuitable for production
**Problem:** Forgeable `X-Session-Id`; `CORS_ORIGINS=*`; `SECRET_KEY` default string.  
**Impact:** Cross-origin abuse + session spoofing if data matters.  
**Fix:** Lock CORS to Vercel origin; require secrets; rate-limit chat; consider signed sessions.

### [P2] Dead banned component + emoji content
**Problem:** `AlexaOrb.tsx` (gradients, cyan, purple, Sparkles, glow). `categoryEmoji` in mock plan.  
**Impact:** Brand lint risk; judge credibility if surfaced.  
**Fix:** Delete AlexaOrb; Lucide icons only; strip emoji fields.

### [P2] No automated FE tests / observability
**Problem:** `package.json` has lint/build only. No error tracking.  
**Fix:** Vitest for api client + confirm state machine; Playwright hero path; Sentry (or equivalent).

---

## Prioritize (kit order)

1. Security defaults (CORS, secrets)  
2. Data integrity (confirm + persist tasks)  
3. Core journeys (chat → plan → confirm)  
4. Error handling (kill silent mock)  
5. Accessibility labels  
6. Tests + basic observability  

---

## Definition of done (not met)

Production-ready when: real API failures are visible; completed never appears without write confirmation; hero E2E green against live backend; secrets/CORS locked; `EXPERIENCE.md` or equivalent screen bible restored; prior `design/audit/REPORT.md` re-run without false “0 violations.”

**Hackathon demo-ready:** Yes, with mock — if judges accept simulated backend.  
**Consumer production-ready:** No.
