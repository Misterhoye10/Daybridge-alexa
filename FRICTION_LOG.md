# Daybridge Developer Friction Log

> **Amazon Developer Hackathon 2026** — *Alexa+ / Agentic Systems Track*

---

### Task Attempted
Truthful state synchronization between conversational agent proposals and canvas state execution.

### Steps Taken
1. User prompts assistant with an intention to modify an active schedule: *"Make the first day easier and add a mock interview"*.
2. Assistant parses intention and generates a proposed action record with status `"awaiting_confirmation"`.
3. Client renders an action diff card displaying the proposed reduction and addition with a **"Confirm changes"** button.
4. User clicks **"Confirm changes"**, triggering `POST /api/actions/:id/confirm` to commit database mutations.

### Expected Result
The proposed diff badge immediately transitions to confirmed, the confirmation button dismisses, and the canvas refreshes with confirmed data without full-page reloads.

### Actual Result
Early iteration retained the *"Confirm changes"* button in chat history and left Monday's group header text uncalibrated because the task's day label was static (`"Monday (1 hr)"`), causing user uncertainty about whether backend state had truly executed.

### Severity Rating
**Medium** (UI confusion, state desynchronization, truthful state violation).

### Workaround Used
Implemented an explicit action confirmation dispatcher in React that:
1. Transitions the chat message action status to `'completed'` and updates the visual badge to `✓ Changes Confirmed`.
2. Acknowledges the commit with an assistant receipt message in chat.
3. Dynamically updates day group labels (`"Monday (30m)"`) alongside task duration (`30m`).
4. Dismisses the canvas pending action banner immediately upon backend confirmation.

### Actionable Suggestion
Agent framework SDKs should provide built-in state machines for two-phase commits (`Propose -> Review -> Confirm -> Execute`) with declarative UI diff binding to prevent premature success assertions and orphaned confirmation controls in conversational agent UIs.
