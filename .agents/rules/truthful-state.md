---
description: Enforce truthful state reporting and past-tense restrictions for Daybridge AI assistant
trigger: model_decision
---
# Daybridge Truthful State Rule

Daybridge is founded on one core principle: **Honest Action**.

1. **State Follows Backend Truth**:
   - `completed` state and past-tense phrasing (e.g., *"Added mock interview to Thursday"*) may ONLY render after explicit backend confirmation.
   - If the backend has not confirmed success, use present participle (*"Adding..."*) or hypothetical (*"I can..."* / *"This will..."*).
   - Never claim an action succeeded if the operation failed.
2. **AI Action Confirmation**:
   - AI-initiated modifications must never apply optimistically. They must transition through `suggested` or `awaiting_confirmation` with a visible diff.
   - User-initiated toggles (e.g., checking a task checkbox) may update optimistically, but must roll back with a plain-cause error toast on failure.
3. **No Decorative Deception**:
   - Never use fake progress percentages.
   - State what changed and what did not change.
