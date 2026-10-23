# Daybridge — Judge guide (60 seconds)

**Product:** Spoken/typed intention → concrete plan → confirm before write → track progress.  
**Framing:** Alexa+-inspired *interaction model* (request → interpret → act → truthful result). Not Amazon branding.

## Browser

| Path | Recommended | Notes |
|---|---|---|
| **Full hero (type)** | Safari, Chrome, Edge, Firefox | Keyboard path is the production bar |
| **Voice in (mic)** | Chrome or Edge | Safari/iOS often works via WebKit; if mic fails, type — by design |
| **Voice out (TTS)** | Safari, Chrome, Edge | Toggle speaker in Assistant header |

**If you are on Safari:** use the **60s demo** pills or type. Mic appears only when the browser exposes speech recognition; permission must be allowed. HTTPS required for mic.

Demo share-screen: prefer **Chrome** for the voice segment; Safari is fine for the typed path.

## First paint

Welcome chat + **No plan open** on the canvas (empty by design). Pill **1 · Create plan** is the first move — the sample plan is not pre-loaded.

## 60-second script (zero typing)

Use the **60s demo** pills on the welcome screen (or the compact row after chat starts):

| Pill | What you should see |
|---|---|
| **1 · Create plan** | PipelineTrace → draft plan (present tense — not “Completed”) |
| **2 · Confirm change** | Awaiting confirmation + diffs → click **Confirm** → past tense only after success |
| **3 · Rebalance 30m** | Chunk/bump proposal → Confirm |
| **4 · Fail drill** | Honest failure + Retry — **no** fake success |

Then optionally: toggle a task · **.ics** / copy Markdown on the plan toolbar · turn **Voice replies** on · **Fail drill** in the header to arm the next Confirm.

## Manual typed path (same story)

1. Open the app (light or dark). Read welcome: *What do you want to get done?*
2. Click chip: **Help me prepare for a software engineering interview…**
3. Watch PipelineTrace: Heard → Understood → Planning → Ready. Draft plan appears (present tense).
4. Ask: **Make the first day easier and add a mock interview**
5. See **Awaiting confirmation** + diffs → **Confirm** → past tense only after success.
6. Toggle a task; open **Saved plans** (or Save plan if draft).
7. Optional: **Voice replies** on; send again — short spoken line plays.
8. Optional: arm **Fail drill** → Confirm or send → Failed + Retry; plan unchanged.

## What “truthful” means here

- Suggested / awaiting use present / “This will…”
- **Completed** and past tense only after backend (or explicit mock confirm) succeeds
- Failed → cause + Retry; plan unchanged
- Silent mock fallback is **off** in production — API errors surface honestly

## Win differentiators (on screen)

| Feature | Where |
|---|---|
| TTS replies | Volume icon in Assistant header |
| Judge scenarios | 60s demo pills |
| Failure drill | Header **Fail drill** or pill **4** |
| Rebalance 30m | Plan toolbar **30m** or pill **3** |
| Calendar export | Plan toolbar **.ics** + copy Markdown |
| Task persist | Toggle on a **saved** plan → API; fail rolls back |

## Env

| Var | Production |
|---|---|
| `VITE_API_URL` | Live backend |
| `VITE_USE_MOCK` | **Omit** (mock only for local `=1`) |
| `ALLOW_DEMO_FAIL=1` | Optional on backend for `X-Demo-Fail` (client drill works without it) |

## Spec pointers

- Experience: `design/EXPERIENCE.md`
- States: `states/README.md` · Voice: `states/voice.md`
- Brand: `design/DESIGN.md`
