# Daybridge — Judge guide (60 seconds)

**Product:** Spoken/typed intention → concrete plan → confirm before write → track progress.  
**Framing:** Alexa+-inspired *interaction model* (request → interpret → act → truthful result). Not Amazon branding.

## Browser

| Path | Recommended | Notes |
|---|---|---|
| **Full hero (type)** | Safari, Chrome, Edge, Firefox | Keyboard path is the production bar |
| **Voice in (mic)** | Chrome or Edge | Safari/iOS often works via WebKit; if mic fails, type — by design |
| **Voice out (TTS)** | Safari, Chrome, Edge | Toggle speaker in Assistant header |

**If you are on Safari:** use the prompt chips or type. Mic appears only when the browser exposes speech recognition; permission must be allowed. HTTPS required for mic.

Demo share-screen: prefer **Chrome** for the voice segment; Safari is fine for the typed path.

## 60-second script (typed — works everywhere)

1. Open the app (light or dark). Read welcome: *What do you want to get done?*
2. Click chip: **Help me prepare for a software engineering interview…**
3. Watch PipelineTrace: Heard → Understood → Planning → Ready. Draft plan appears (present tense — not “Completed”).
4. Click chip or ask: **Make the first day easier and add a mock interview**
5. See **Awaiting confirmation** + diffs → **Confirm** → past tense only after success.
6. Toggle a task; open **Saved plans** (or Save plan if draft).
7. Optional: turn **Voice replies** on (volume icon); send again — short spoken line plays.
8. Optional stress: go offline / kill API — banner + Retry; never fake success.

## What “truthful” means here

- Suggested / awaiting use present / “This will…”
- **Completed** and past tense only after backend (or explicit mock confirm) succeeds
- Failed → cause + Retry; plan unchanged

## Env

| Var | Production |
|---|---|
| `VITE_API_URL` | Live backend |
| `VITE_USE_MOCK` | **Omit** (mock only for local `=1`) |

## Spec pointers

- Experience: `design/EXPERIENCE.md`
- States: `states/README.md` · Voice: `states/voice.md`
- Brand: `design/DESIGN.md`
