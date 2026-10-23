# Daybridge — Experience blueprint

> Screen, flow, and behavior source of truth. Brand tokens live in `DESIGN.md`. Data shapes live in `API_CONTRACT.md`. When layout and DESIGN conflict, **this file wins on layout and behavior**.

**Status:** Restored 2026-10-23 from DESIGN + shipped UI (original file was missing from repo).

---

## 1. Product model (30-second test)

In 30 seconds a new user should understand:

1. They talk to an assistant (left).
2. The assistant builds a plan (right).
3. Changes that write state require **Confirm** — past tense only after success.

**Primary job:** *When I say what I want done and how much time I have, give me a concrete plan I can confirm, track, and trust.*

---

## 2. Surfaces

| Surface | Job | Primary action |
|---|---|---|
| Chat welcome | Capture intention | Send / prompt chip |
| Chat thread | Conversation + action cards | Confirm / Dismiss |
| Plan canvas (open) | Review, edit, track | Toggle task / Save |
| Plan canvas (empty) | Teach next step | Focus composer (“Ask for a plan”) |
| Saved plans drawer | Library | Open / Delete (confirm) |
| Token swatch (`/design`) | Dev QA | Back — hide from prod chrome when possible |

### Empty types (do not conflate)

| Empty | Copy |
|---|---|
| **No plan open** (canvas) | Headline: `No plan open`. Support: `Ask on the left for a goal and how much time you have. I'll build the plan here.` |
| **No saved plans** (drawer) | `No saved plans yet.` / `Ask for one, then save it here.` |

---

## 3. Hero layout

### Desktop ≥ 1024 — pinned dual pane
```
┌─ Header 56px: Logo | New plan | Saved plans | Theme | (DS) | Reset ─┐
├──────────────────────────┬──────────────────────────────────────────┤
│ Chat column max 720px    │ Plan canvas ~440–780px                   │
│ Welcome OR thread        │ EmptyState OR timeline/board             │
│ Composer sticky bottom   │ Progress, day filter, tasks              │
└──────────────────────────┴──────────────────────────────────────────┘
```
No FAB. Plan stays visible — Continuity with the conversation (#1, #12).

### Mobile / tablet &lt; 1024 — chat-first + Plan FAB → sheet
```
┌─ Header: mark | New | Saved | Theme ─┐
│ Chat (full width)                     │
│ Composer                              │
│                              [ Plan ] │  ← FAB (Harbor pill)
└───────────────────────────────────────┘
FAB opens full-height plan sheet (handle + Close, Esc / scrim).
Auto-opens when a draft/plan arrives or confirm is needed.
```
Primary job stays *ask* (#2). Plan is a destination sheet (#20), not a peer tab.

---

## 4. Truthful state machine

| State | UI tense | When |
|---|---|---|
| Suggested | “I can…” | Draft plan returned; not saved |
| Awaiting confirmation | “This will…” | Proposed mutation; Confirm / Dismiss |
| Running | “Applying…” | Confirm in flight |
| Completed | Past tense | **Only** after `ok: true` from confirm/save |
| Failed | Cause + outcome | Confirm/save/network error; nothing claimed changed |

**Forbidden:** Marking `completed` in the client before the API (or explicit mock confirm) succeeds. Silent mock fallback in production is forbidden (`VITE_USE_MOCK=1` only).

---

## 5. Core flows

### F1 — Create plan
1. User sends goal + time (or prompt chip).
2. Assistant returns **draft** `plan` (present tense). No completed badge.
3. Canvas shows draft. User may Save → library (`status: saved`).

### F2 — Propose update
1. User asks to change plan.
2. Assistant returns `action` with `awaiting_confirmation` + diffs.
3. User Confirm → `POST /api/actions/:id/confirm` → Completed + canvas update.
4. Or Dismiss → cancel; plan unchanged.

### F3 — Track
1. Toggle tasks on canvas.
2. Progress updates. Persist via task API when backend available.

### F4 — New plan
1. Clears chat + active plan.
2. Canvas shows **No plan open** empty (not library empty copy).

---

## 6. Microcopy (locked — from DESIGN)

| Moment | Copy |
|---|---|
| Welcome headline | What do you want to get done? |
| Welcome support | Tell me the goal and how much time you have. I'll build the plan. |
| Composer | Say it or type it... |
| Network lost | Connection lost. Your conversation is safe. Retry when you're back online. |
| Invalid AI | That plan didn't come through right. Try again, or rephrase your request. |

Do not invent new copy without updating DESIGN §2.

---

## 7. Banned in product UI

From DESIGN / AGENTS: gradients on fills, glows, sparkle/AI badges, purple/cyan accents, Alexa ring, emoji in copy, past tense before confirmed write, nested card grids.

`AlexaOrb` is legacy — do not mount.

---

## 8. QA checklist (hero path)

- [ ] Welcome + three prompts + composer at 1440 and 390, light and dark
- [ ] Prompt chip creates draft plan; no green “Completed” until save/confirm
- [ ] “Make first day easier…” shows awaiting confirmation + Confirm
- [ ] Confirm success → past tense; Confirm fail → Failed + Retry, plan unchanged
- [ ] Kill API (no mock) → network/error copy, not fake plan
- [ ] New plan → “No plan open” empty + Ask for a plan focuses composer
- [ ] Chat loading with no plan → plan skeleton (not empty)
- [ ] Offline → sticky banner; send blocked with Retry when back
- [ ] Save → Saving… then toast “Saved to library.”
- [ ] Saved drawer: loading skeleton; error + Retry; empty uses library copy
- [ ] Icon-only header controls have `aria-label` and ≥44px targets
- [ ] `prefers-reduced-motion` respected on PipelineTrace / skeletons
- [ ] Mic hidden when Web Speech STT unsupported; permission/no-speech errors show cause + Retry
- [ ] Voice replies toggle (TTS); speaks `message.spoken` only; Off persists
- [ ] PipelineTrace: Heard → Understood → Planning → Ready (≥350ms), failed on error
- [ ] **Safari typed path:** welcome → prompt chip → draft → confirm → save (mic optional)
- [ ] Judge script in `JUDGE.md` matches live deploy

State matrix: `states/README.md` · Voice: `states/voice.md` · Judges: `JUDGE.md`.

---

## 9. Env

| Var | Meaning |
|---|---|
| `VITE_API_URL` | Backend base URL |
| `VITE_USE_MOCK=1` | Local simulation only. Omit in production. |
