# Good UX States audit — Daybridge v1 — 2026-10-23

**JTBD:** When I say what I want done and how much time I have, give me a concrete plan I can confirm, track, and trust.

**Verdict:** Iterate → **Ship for hackathon hero path** after this pass. Remaining: task persist rollback when API exists.

| Feature | Current | Problem | Recommended | Priority | Done |
|---|---|---|---|---|---|
| Chat send | Loading + soft error | No Retry / offline | Banner + Retry + offline strip | P0 | ✓ |
| Invalid / empty AI | Generic catch | Wrong copy | DESIGN invalidAi copy | P0 | ✓ |
| Confirm action | Truthful completed | Failed had no Retry | Retry on failed card | P0 | ✓ |
| Plan empty | Fixed copy | — | Keep two empty types | — | ✓ |
| Plan loading | Missing | Blank or stale empty | PlanSkeleton when !plan && loading | P1 | ✓ |
| Save | Thread confirm only | No button loading / toast | Saving… + 4s toast | P1 | ✓ |
| Offline | Copy unused | Silent fail feel | Sticky OfflineBanner | P0 | ✓ |
| Library load | Soft-fail only | No retry in drawer | Skeleton + error + Retry on open | P1 | ✓ |
| Skeleton shimmer | Gradient shimmer | Violates DESIGN | Opacity pulse | P2 | ✓ |
| Task persist fail | Local only | N/A until API | Rollback + inline error | P2 | Deferred |

## Eight questions (hero Confirm)

1. Happening? Running tag + Applying…  
2. Registered? Button removed / locked  
3. Still working? Running state  
4. How long? Short mutation — no fake progress  
5. Continue? Chat still readable  
6. Succeeded? Completed + past tense + highlight fade  
7. Failed? Failed + cause + Retry  
8. Next? Canvas updated or unchanged  

## Specs

See `states/*.md`.
