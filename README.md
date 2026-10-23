# Daybridge

AI planning assistant: natural-language intention → sequenced plan → confirm-before-write → track progress.  
Built as an **Alexa+-inspired** web simulation for the Amazon Developer Hackathon 2026 (interaction model only — no Alexa ring / Amazon marks).

## Quick start

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL; use VITE_USE_MOCK=1 only for local sim
npm install
npm run dev
```

## Judges

See **[JUDGE.md](./JUDGE.md)** — zero-typing **60s demo** pills, failure drill, .ics export, browser notes, truthful-state rules.

| Browser | Typed hero | Mic | TTS |
|---|---|---|---|
| Chrome / Edge | ✓ | Best | ✓ |
| Safari | ✓ (primary bar) | When WebKit allows | ✓ |
| Firefox | ✓ | Mic hidden (no STT) | ✓ |

## Specs

| Doc | Role |
|---|---|
| `design/EXPERIENCE.md` | Screens & behavior |
| `design/DESIGN.md` | Brand & tokens |
| `states/README.md` | State matrix |
| `states/voice.md` | STT / TTS |
| `API_CONTRACT.md` | Data shapes |

## Deploy

- Frontend: Vercel — **omit** `VITE_USE_MOCK` in production  
- Backend: Render — set `VITE_API_URL` to that origin  
