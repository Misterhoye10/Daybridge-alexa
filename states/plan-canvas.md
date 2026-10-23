# States — Plan canvas

## Surface: Active plan panel / mobile sheet

### Default (populated)
- Draft or saved badge, progress, day filter, timeline/board, tasks.
- Primary: toggle task · Save (if draft).

### Empty — no plan open (zero data)
- **Title:** No plan open
- **Body:** Ask on the left for a goal and how much time you have. I'll build the plan here.
- **CTA:** Ask for a plan → focuses composer
- **Not** library empty copy (#3 — two empty types).

### Empty — filtered to zero
- **Title:** No items match the selected filter.
- **Body:** Clear day filter or choose All.
- **CTA:** implicit — day chips include All.

### Loading
- Plan skeleton (header + 3 task rows), static blocks / opacity pulse — **no shimmer** (DESIGN §8).
- Shown when chat is loading and canvas has no plan yet.
- If a plan already exists, keep it; chat PipelineTrace owns the wait.

### Error — server
- Confirm/save failures surface on action card + chat banner; plan unchanged.
- Task toggles are local for demo — no persist error until task API wired.

### Error — offline
- Banner at app shell; canvas stays readable; Save/Confirm retry when online.

### Success
- Confirm completed → past-tense label + row highlight fade (1.2s).
- Save → “Saved” in thread + toast “Saved to library.”

### Permission denied
- N/A.

## Interactive: Save plan

| State | Visual | Copy | Notes |
|---|---|---|---|
| Default | primary / secondary | Save | |
| Loading | button loading | Saving… | |
| Disabled | muted | Saved plan | Already in library — reason inline |
