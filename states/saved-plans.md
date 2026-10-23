# States — Saved plans drawer

## Surface: Library sheet

### Default (populated)
- List of saved plans with progress, Open, Delete.

### Empty — zero data
- **Title:** No saved plans yet.
- **Body:** Ask for one, then save it here.
- Distinct from canvas “No plan open.”

### Empty — filtered
- N/A (no search/filter in v1).

### Loading
- Skeleton list (2–3 rows) while `getPlans` in flight on open/refresh.

### Error — server
- Inline: “Couldn't load saved plans. Retry.” + Retry CTA.
- Soft-fail on first paint still allowed (empty library, no banner) so welcome isn’t hostile.

### Error — offline
- App offline banner; drawer shows last known list or empty + retry.

### Success
- Open → canvas updates (state change).
- Delete → row removed after confirm (destructive confirm inline).

### Permission denied
- N/A.
