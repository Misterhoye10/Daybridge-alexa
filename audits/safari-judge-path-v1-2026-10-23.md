# Safari / judge path — 2026-10-23

**Machine note:** No Safari on this Windows workspace. Hardening + Chromium smoke of the **typed** hero path (the Safari production bar).

## Code changes
- STT centralized in `voice/stt.ts`: stop on final result (WebKit continuous quirk), user-gesture start, no fake transcript
- Shell / plan sheet: `100vh` / `92vh` fallbacks before `dvh`
- `JUDGE.md` + README browser table

## Chromium smoke (typed) — PASS
1. New plan → **No plan open** empty  
2. Prompt chip → draft plan, present-tense assistant copy (“I can structure…”)  
3. Voice replies toggle present; mic present (Chromium STT)

**Still do on a Mac before submit:** Safari typed path once; optional mic permission grant.
