# States — Action card (truthful machine)

Cross-cutting: chat thread + plan canvas chrome. EXPERIENCE §4.

| State | UI tense | Affordance | Notes |
|---|---|---|---|
| Suggested | “I can…” | Apply / Dismiss | Draft; not saved |
| Awaiting confirmation | “This will…” | Confirm / Dismiss | Diffs expand |
| Running | “Applying…” | Locked, no Confirm | Confirm in flight |
| Completed | Past tense | — | **Only** after API `ok: true` |
| Failed | Cause + outcome | Retry / Dismiss | Plan unchanged |
| Dismissed | Quiet | — | Local cancel |

**Forbidden:** client `completed` before confirm/save succeeds. Silent production mock forbidden.
