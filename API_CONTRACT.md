# Daybridge — Backend API Specification & Contract

> **Target Backend**: Python / Flask (or FastAPI)  
> **Target Database**: Supabase / PostgreSQL (or SQLite for initial hackathon testing)  
> **Frontend Port**: `http://localhost:5173` (CORS enabled for local development)  
> **Default Backend Port**: `http://localhost:5000`

---

## 1. Overview & PRD Alignment

The frontend is built with a dual-pane interface:
1. **Conversational Assistant (Left)**: Natural-language request parser and action recommender.
2. **Interactive Plan Canvas (Right)**: Real-time structured task board with state tracking.

To fulfill **PRD Section 5.5 (Action Execution and Confirmation)** and **PRD Section 10 (Primary Demonstration Scenario)**, every conversational response that impacts a plan must return structured data containing:
- Natural-language explanation message
- Optional structured `Plan` object
- Optional `AssistantAction` descriptor with action state: `suggested`, `awaiting_confirmation`, or `completed`.

---

## 2. API Endpoints

### 2.1 Process Conversational Request
- **Endpoint**: `POST /api/chat`
- **Description**: Parses user's goal or follow-up prompt, calls AI model with tool/function schema, and returns response + structured actions.

#### Request Body
```json
{
  "message": "Help me prepare for a software engineering interview on Friday. I have one hour each evening.",
  "sessionId": "optional-uuid",
  "currentPlanId": "optional-active-plan-id",
  "currentPlanState": { /* Current Plan object if available */ },
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

#### Response Body (`200 OK`)
```json
{
  "message": "I've structured a 5-evening preparation plan for your software engineering interview this Friday. Each evening is scheduled for 60 minutes.",
  "plan": {
    "id": "plan-1718290",
    "title": "Software Engineering Interview Prep",
    "summary": "5-day sprint allocating 1 focused hour each evening until Friday.",
    "objective": "Master core coding patterns and behavioral answers.",
    "createdAt": "2026-10-21T05:00:00.000Z",
    "updatedAt": "2026-10-21T05:00:00.000Z",
    "completionPercentage": 0,
    "tasks": [
      {
        "id": "task-101",
        "title": "Review Core Data Structures & Complexities",
        "description": "Brush up on Arrays, Hash Tables, Trees, and Big-O trade-offs.",
        "day": "Monday (1 hr)",
        "priority": "high",
        "estimatedMinutes": 60,
        "isCompleted": false,
        "orderIndex": 0
      }
    ]
  },
  "action": {
    "id": "act-901",
    "type": "create_plan",
    "label": "Plan Created",
    "description": "5-Day Software Engineering Prep Plan loaded to canvas",
    "state": "completed",
    "payload": { /* optional metadata */ }
  },
  "suggestedFollowUps": [
    "Make the first day easier and add a mock interview",
    "I only have 30 minutes today. Adjust my schedule",
    "Show me the tasks I haven't completed"
  ]
}
```

---

### 2.2 Plans CRUD Endpoints

#### Save / Create Plan
- **Endpoint**: `POST /api/plans`
- **Payload**: Full `Plan` object
- **Response**: `201 Created` with saved `Plan`

#### Retrieve Saved Plans
- **Endpoint**: `GET /api/plans`
- **Response**: Array of `Plan` objects `[ { ... }, { ... } ]`

#### Retrieve Specific Plan
- **Endpoint**: `GET /api/plans/:id`
- **Response**: `Plan` object

#### Update Plan Details
- **Endpoint**: `PATCH /api/plans/:id`
- **Payload**: Partial plan fields (`title`, `summary`, `completionPercentage`)

#### Update Task Details or Completion Status
- **Endpoint**: `PATCH /api/tasks/:id`
- **Payload**: `{ "isCompleted": true }` or `{ "title": "...", "priority": "high" }`

#### Delete Plan
- **Endpoint**: `DELETE /api/plans/:id`
- **Response**: `{ "success": true }`

---

## 3. Action Execution States

| State | Purpose |
| :--- | :--- |
| `suggested` | AI proposes a plan change. Frontend displays warm amber review badge with "Apply Changes" button. |
| `awaiting_confirmation` | Destructive change (e.g. replacing existing plan). Frontend prompts confirmation. |
| `completed` | Already committed and executed on backend. Frontend immediately renders updated canvas. |
| `failed` | Operation failed. Returned with error description; frontend notifies user without losing context. |

---

## 4. Primary Demo Test Prompts

1. **Initial Plan Generation**:  
   `"Help me prepare for a software engineering interview on Friday. I have one hour each evening."`
2. **Context-Aware Modification**:  
   `"Make the first day easier and add a mock interview."`
3. **Dynamic Re-scheduling**:  
   `"I only have 30 minutes today. Adjust my schedule."`
