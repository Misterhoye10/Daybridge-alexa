# Daybridge API contract (frontend and backend)

**Status**: proposed by the frontend. The backend engineer confirms or amends it, then both sides freeze it. The frontend builds against a mock that implements this contract exactly, so switching to the real backend is a base-URL change.

Additions to the PRD endpoint list are marked `(new)`. They are needed by the confirm-before-write behavior and the UI.

---

## 1. Conventions

- **Base URL**: from `VITE_API_URL`. JSON only. CORS must allow the Vercel origin and localhost.
- **Session Header**: Every request carries `X-Session-Id: <uuid>`. The frontend generates it once and stores it in `localStorage`. Plans, tasks, conversations, and actions are scoped to it. No login.
- **Response Format**:
  - Success: HTTP 2xx and body `{ "ok": true, ... }`.
  - Failure: HTTP 4xx or 5xx and body `{ "ok": false, "error": { "code": string, "message": string, "retryable": boolean } }`.
- **Truthful Failure Handling**: The frontend treats anything that is not (2xx and ok: true), a timeout (30 s), or a network error as a failure. It never claims success on those.
- **Data Formats**: IDs are strings. Dates are `YYYY-MM-DD` (local plan days) or ISO 8601 (timestamps).
- **Keep-Alive**: `GET /api/health` returns `{ "ok": true }`. Used for the keep-alive ping.
- **Demo Failure Drill**: when the env var `ALLOW_DEMO_FAIL=1` is set and a request has the header `X-Demo-Fail: next`, the server responds 503 with code `demo_forced_failure` and performs no side effects. Used only for the demo video and tests.

### Error codes

| Code | HTTP | Retryable | Meaning |
| :--- | :--- | :--- | :--- |
| `validation_error` | 400 | no | Bad input from the client |
| `not_found` | 404 | no | Plan, task, or action does not exist |
| `action_expired` | 409 | no | The proposed action is no longer valid (plan changed or expired) |
| `rate_limited` | 429 | yes | Too many requests |
| `invalid_ai_output` | 502 | yes | Model output failed schema validation after one retry |
| `ai_unavailable` | 502 | yes | Model call failed or timed out |
| `server_error` | 500 | yes | Anything else |
| `demo_forced_failure` | 503 | yes | Forced by `X-Demo-Fail` |

---

## 2. Types

```ts
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;            // max 80 chars
  description: string;      // max 280 chars, may be empty
  day: string;              // YYYY-MM-DD
  minutes: number;          // 5..180
  priority: Priority;
  done: boolean;
  position: number;         // order within the plan
}

export interface Plan {
  id: string;               // drafts use "draft_<random>"
  title: string;            // max 80 chars
  objective: string;        // max 240 chars
  status: 'draft' | 'saved';
  tasks: Task[];            // max 12
  created_at: string;
  updated_at: string;
}

export interface PlanSummary {
  id: string;
  title: string;
  task_count: number;
  done_count: number;
  minutes_total: number;
  updated_at: string;
}

export type ToolName = 'create_plan' | 'propose_plan_update' | 'list_tasks' | 'answer';

export interface TraceStage {
  stage: 'heard' | 'understood' | 'tool' | 'result';
  label: string;            // "Heard", "Understood", "Planning", "Ready"
  tool?: ToolName;          // set on the "tool" stage
  ms: number;               // real elapsed time for this stage
  ok: boolean;
}

export interface PlanChange {
  kind: 'added' | 'changed' | 'removed';
  task_id: string | null;   // null for added
  title: string;
  detail: string;           // "40 -> 20 min", "Thu · 30 min", "Thu · 45 min · High"
  before?: Partial<Task>;
  after?: Partial<Task>;    // full Task fields (minus id) for added
}

export interface ProposedAction {
  id: string;
  kind: 'update_plan';
  plan_id: string;
  title: string;            // "Update \"Software engineering interview prep\""
  changes: PlanChange[];
  status: 'awaiting_confirmation';
  expires_at: string;
}

export type ApiError = { code: string; message: string; retryable: boolean };
```

---

## 3. Endpoints

### `POST /api/chat`
Process one user message. Never writes plan data. It may return a new draft plan or a proposed action. It never executes changes.

#### Request:
```json
{
  "message": "Make the first day easier and add a mock interview.",
  "conversation_id": "optional",
  "context": { "plan": { "...": "the Plan currently open (draft or saved), optional" } },
  "client": { "now": "2026-10-26T18:00:00+01:00", "timezone": "Africa/Lagos" }
}
```

#### Success:
```json
{
  "ok": true,
  "conversation_id": "c_123",
  "trace": [
    { "stage": "heard", "label": "Heard", "ms": 12, "ok": true },
    { "stage": "understood", "label": "Understood", "ms": 640, "ok": true },
    { "stage": "tool", "label": "Prepared a change", "tool": "propose_plan_update", "ms": 520, "ok": true },
    { "stage": "result", "label": "Ready", "ms": 8, "ok": true }
  ],
  "message": {
    "text": "I can make Monday lighter and add a mock interview on Thursday. Here's what would change.",
    "spoken": "I can make Monday lighter and add a mock interview on Thursday."
  },
  "plan": null,
  "action": { "...": "ProposedAction" },
  "references": [],
  "tasks": null
}
```

#### Rules:
- At most one of `plan` and `action` is non-null.
- `plan` is a new draft (`status: "draft"`, temporary ids). It is not stored until the client calls `POST /api/plans`.
- `action` is stored server-side with a 15-minute expiry. Nothing in the plan changes until the client confirms it.
- `references` is a list of task ids to render as inline task chips (*"What should I work on first?"*).
- `tasks` is a list of tasks for read-only display (*"Show me the tasks I haven't completed"*).
- `message.spoken` is optional, at most 20 words, plain text, no markup. It is what the app reads aloud.
- Plain questions and unsupported requests return only `message`. Unsupported: *"I can't do that yet. I can plan, edit tasks, and track progress."*
- `trace` reports real stages and real timings. Never invent a stage that did not run.

---

### `POST /api/actions/:id/confirm` (new)
Execute a proposed action. All-or-nothing, in one transaction. Idempotent: confirming the same action twice returns the same result.

#### Success:
```json
{
  "ok": true,
  "action_id": "a_9",
  "status": "completed",
  "plan": { "...": "the updated saved Plan" },
  "applied": [ { "...": "PlanChange" } ],
  "summary": "Monday is now 40 minutes. Added Mock interview on Thursday. Removed Review your weak spots."
}
```

The frontend renders `Completed` only from this response. On any error, the plan is unchanged and the frontend shows `Failed` with *"Nothing was changed."* Errors: `action_expired`, `not_found`, `server_error`.

---

### `POST /api/actions/:id/cancel` (new)
Returns `{ "ok": true, "status": "dismissed" }`.

---

### `POST /api/plans`
Save a draft.
- **Request**: `{ "plan": Plan }` (the draft).
- Server assigns real ids, sets `status: "saved"`.
- **Response**: `{ "ok": true, "plan": Plan }`. The frontend replaces the draft with this plan.

---

### `GET /api/plans`
`{ "ok": true, "plans": PlanSummary[] }`, newest updated first.

---

### `GET /api/plans/:id`
`{ "ok": true, "plan": Plan }`

---

### `PATCH /api/plans/:id`
- **Body**: `{ "title"?: string, "objective"?: string }`
- **Response**: `{ "ok": true, "plan": Plan }`

---

### `DELETE /api/plans/:id`
- **Response**: `{ "ok": true, "deleted_id": string }`. The confirmation dialog is client-side.

---

### `PATCH /api/tasks/:id`
- **Body**: any of `done`, `title`, `description`, `priority`, `day`, `minutes`.
- **Response**:
```json
{ "ok": true, "task": { "...": "Task" }, "progress": { "done": 1, "total": 8, "minutes_left": 205 } }
```

---

### `POST /api/plans/:id/tasks` (new)
- **Body**: `{ "title": string, "description"?: string, "day": string, "minutes": number, "priority": Priority }`.
- **Response**: `{ "ok": true, "task": Task, "plan": Plan }`.

---

### `DELETE /api/tasks/:id` (new)
- **Response**: `{ "ok": true, "deleted_id": string, "plan": Plan }`.

---

## 4. Backend behavior requirements

1. **AI output is validated**: Parse model output into Pydantic models that mirror section 2. If invalid, retry once with the validation error appended. If still invalid, return 502 `invalid_ai_output`. Never pass unvalidated model output to the client or the database.
2. **The model never writes**: It can only call whitelisted tools: `create_plan`, `propose_plan_update`, `list_tasks`, `answer`. Writes happen only in `confirm`, `POST /api/plans`, and the task and plan endpoints. The model never sees credentials and never runs code.
3. **Plans respect the user's constraints**: The prompt receives `client.now` and `client.timezone`. Task days fall between today and the stated deadline. Minutes per day never exceed the stated availability. Max 12 tasks per plan.
4. **Follow-ups use context**: The plan in `context.plan` is the source of truth for follow-ups. Proposed changes reference real task ids from it.
5. **Failures are honest**: Any failure after a write begins rolls back. Responses never say success for a failed operation.
6. **Limits**: AI call timeout 25 s. Rate limit 20 requests per minute per session. A global daily spend cap on AI calls that returns 429 `rate_limited` when reached. The deployed demo must stay up and funded through 20 November 2026.
7. **Keep warm**: `GET /api/health` responds in under 200 ms. A cron or uptime pinger calls it every 5 minutes.
8. **Secrets**: Keys live in server env vars. `.env` is git-ignored. Verify before every push.
9. **Demo reliability**: Write a regression test for the two demo prompts below. They must return structurally valid results on at least 9 of 10 runs: use low temperature and a tight schema.
   - **Demo prompt 1**: *"Help me prepare for a software engineering interview on Friday. I have one hour each evening."* Expected: a draft plan with about 8 tasks over the evenings before Friday, at most 60 minutes per evening.
   - **Demo prompt 2** (with that plan in context): *"Make the first day easier and add a mock interview."* Expected: a `propose_plan_update` action with one changed, one added, and optionally one removed task, and a lighter first day.

---

## 5. Frontend behavior (for the backend engineer's information)

- The frontend keeps the active plan in memory and sends it as `context.plan` on every chat call.
- The `PipelineTrace` renders from `trace`. It plays stages back no faster than 350 ms each after the response arrives. If you later add streaming (SSE), the same stage objects can be sent as events.
- Saved plans are loaded with `GET /api/plans` on app start and `GET /api/plans/:id` on selection.
- Task checkbox toggles are optimistic and roll back if `PATCH /api/tasks/:id` fails.
- AI-initiated changes are never optimistic. They wait for `confirm`.
