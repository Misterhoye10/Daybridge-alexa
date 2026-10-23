# Daybridge API Contract & Frontend Integration Guide

This document is the official specification for frontend developers connecting to the Daybridge Alexa+ backend.

---

## 1. Base URL
- **Local Development:** `http://localhost:5000` (or `http://127.0.0.1:5000`)
- **Production (Render):** Set via environment variable `VITE_API_BASE_URL`

CORS is enabled for all origins during development (`localhost:5173`, `localhost:3000`).

---

## 2. TypeScript Interfaces
Copy-paste these interfaces directly into your React project (e.g., `src/types/api.ts`):

```typescript
export interface Task {
  id: string;
  plan_id: string;
  order: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  due_date: string | null;          // e.g. "Monday", "2026-10-24"
  estimated_minutes: number;       // e.g. 30, 60
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  title: string;
  summary: string;
  target_date: string | null;       // e.g. "Friday"
  status: 'active' | 'completed' | 'archived';
  progress_percentage: number;      // 0 to 100
  total_tasks: number;
  completed_tasks: number;
  tasks: Task[];
  created_at: string;
  updated_at: string;
}

export type ActionType = 'CREATE_PLAN' | 'UPDATE_PLAN' | 'COMPLETE_TASK' | 'DELETE_PLAN' | 'NONE';
export type ActionStatus = 'completed' | 'suggested' | 'awaiting_confirmation' | 'failed' | 'none';

export interface ChatAction {
  type: ActionType;
  status: ActionStatus;
  data: Plan | null;
  error?: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;                    // Conversational assistant message
  action: ChatAction;               // Structured action executed by backend
}

export interface ChatRequest {
  message: string;
  conversation_history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  active_plan_id?: string | null;
}
```

---

## 3. Endpoints Specification

### 3.1 Conversational Alexa+ Brain (`POST /api/chat`)
This is the main endpoint. It takes natural language input, maintains conversation context, and performs backend actions (creating plans, updating tasks, re-scheduling).

* **URL:** `POST /api/chat`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "message": "Help me prepare for a software engineering interview on Friday. I have one hour each evening.",
  "conversation_history": [
    { "role": "user", "content": "Hi Daybridge" },
    { "role": "assistant", "content": "Hello! What can I help you plan?" }
  ],
  "active_plan_id": "optional-uuid-of-currently-selected-plan"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "reply": "I've put together a focused 4-day plan to get you ready for your interview on Friday.",
  "action": {
    "type": "CREATE_PLAN",
    "status": "completed",
    "data": {
      "id": "2627afc6-1db7-4d77-a710-909a6a212346",
      "title": "Software Engineering Interview Preparation",
      "summary": "4-day study plan, 1 hour each evening until Friday",
      "target_date": "Friday",
      "status": "active",
      "progress_percentage": 0,
      "total_tasks": 4,
      "completed_tasks": 0,
      "tasks": [
        {
          "id": "33274976-4ec5-4555-ae2a-4b09536a158f",
          "plan_id": "2627afc6-1db7-4d77-a710-909a6a212346",
          "order": 1,
          "title": "Data Structures & Algorithms Review",
          "description": "Arrays, hashing, and complexity review",
          "priority": "medium",
          "due_date": "Monday",
          "estimated_minutes": 60,
          "is_completed": false
        }
      ]
    }
  }
}
```

---

### 3.2 List All Plans (`GET /api/plans`)
* **URL:** `GET /api/plans`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "plans": [ /* Array of Plan objects with tasks included */ ]
}
```

---

### 3.3 Get Single Plan (`GET /api/plans/:id`)
* **URL:** `GET /api/plans/<plan_id>`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "plan": { /* Plan object */ }
}
```

---

### 3.4 Toggle or Update Task (`PATCH /api/tasks/:id`)
Use this when the user clicks a checkbox or edits a task in the UI.

* **URL:** `PATCH /api/tasks/<task_id>`
* **Request Body:**
```json
{
  "is_completed": true,
  "title": "Optional new title",
  "estimated_minutes": 45
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "task": { /* Updated Task object */ },
  "plan_progress": 25
}
```

---

### 3.5 Delete Plan (`DELETE /api/plans/:id`)
* **URL:** `DELETE /api/plans/<plan_id>`
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Plan successfully deleted."
}
```

---

## 4. Frontend Integration Example (React Fetch)

```typescript
export async function sendAlexaMessage(
  message: string, 
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  activePlanId?: string
): Promise<ChatResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversation_history: history,
      active_plan_id: activePlanId || null,
    }),
  });
  return res.json();
}
```
