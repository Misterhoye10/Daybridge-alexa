# States — Chat

## Surface: Welcome + thread + composer

### Default (populated)
- Description: Thread of user/assistant bubbles; action cards inline; follow-up chips above composer.
- Primary action: Send (or Confirm on an awaiting card).
- Layout: max ~720px chat column; composer sticky.

### Empty — zero data / first run
- **Title:** What do you want to get done?
- **Body:** Tell me the goal and how much time you have. I'll build the plan.
- **CTA:** Prompt chips + composer (“Say it or type it...”)
- **Why not a 404:** Expected first paint; teaches the job (#3, #9).

### Empty — filtered to zero
- N/A (chat has no filters).

### Loading
- PipelineTrace advances; inline “Building your plan…” under thread.
- Composer disabled with reason (send grey while `isLoading`).
- Canvas may show plan skeleton if no plan is open yet (see plan-canvas).

### Partial
- Library fetch soft-fails: chat still works; saved count may be 0.
- Offline: prior messages stay; new sends blocked with offline banner + retry when back.

### Error — server / AI
- **Body:** Cause + fix (DESIGN): e.g. “That plan didn't come through right. Try again, or rephrase your request.”
- **CTA:** Retry (resend last user message) · Dismiss
- Placement: inline banner in thread (`role="alert"`). Toast never carries blocking errors (#20).

### Error — offline / network
- **Body:** Connection lost. Your conversation is safe. Retry when you're back online.
- Sticky offline banner under header + thread alert on failed send.

### Success / confirmation
- Assistant message appears; draft plan lands on canvas (present tense).
- Confirm/save success: completed action chip + optional 4s toast for save (low-risk).

### Permission denied
- N/A (no auth).

## Interactive: Send button

| State | Visual | Copy / a11y | Notes |
|---|---|---|---|
| Default | Harbor when text present | aria-label Send | |
| Hover / focus | ring | | |
| Loading | disabled | “Structuring plan…” in status | Guard double-submit |
| Disabled | muted | No text / loading | Reason via status line |
