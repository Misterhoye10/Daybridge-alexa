import type {
  Plan,
  PlanSummary,
  Task,
  ProposedAction,
  ApiChatRequest,
  ApiChatResponse,
  TraceStage,
  PlanChange
} from '../types/daybridge';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Session UUID generator per API contract Section 1
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'session_ssr';
  let id = localStorage.getItem('daybridge_session_id');
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('daybridge_session_id', id);
  }
  return id;
}

// Initial flagship mock data following PRD Section 10 Primary Demonstration Scenario
export const INITIAL_INTERVIEW_PREP_PLAN: Plan = {
  id: 'plan-swe-interview-prep',
  title: 'Software Engineering Interview Prep',
  summary: 'A structured 5-day preparation sprint allocating 1 focused hour each evening until Friday.',
  objective: 'Ace technical coding and behavioral rounds through systematic review.',
  status: 'saved',
  created_at: '2026-10-21T05:00:00.000Z',
  updated_at: '2026-10-21T05:00:00.000Z',
  createdAt: '2026-10-21T05:00:00.000Z',
  updatedAt: '2026-10-21T05:00:00.000Z',
  completionPercentage: 17,
  dailyCapacityMinutes: 60,
  tasks: [
    {
      id: 'task-1',
      kind: 'task',
      area: 'Engineering',
      title: 'Review Core Data Structures & Complexities',
      description: 'Brush up on Arrays, Hash Tables, Trees, and Big-O trade-offs.',
      day: 'Monday (1 hr)',
      minutes: 60,
      estimatedMinutes: 60,
      priority: 'high',
      done: true,
      isCompleted: true,
      position: 0,
      orderIndex: 0,
      deadlineType: 'SOFT',
      isChunkable: true,
      scheduleStatus: 'completed',
      categoryEmoji: '🧠',
      subtasks: [
        { id: 'sub-1a', kind: 'task', area: 'Engineering', title: 'Binary Trees & Traversals', description: 'In-order, pre-order, and level-order traversal patterns', minutes: 25, estimatedMinutes: 25, priority: 'high', done: true, isCompleted: true, position: 0, orderIndex: 0, day: 'Monday (1 hr)' },
        { id: 'sub-1b', kind: 'task', area: 'Engineering', title: 'Hash Table collisions & load factor', description: 'Chaining vs open addressing tradeoffs', minutes: 20, estimatedMinutes: 20, priority: 'high', done: true, isCompleted: true, position: 1, orderIndex: 1, day: 'Monday (1 hr)' },
        { id: 'sub-1c', kind: 'task', area: 'Engineering', title: 'Quick summary cheat sheet', description: 'Space/time complexity reference notes', minutes: 15, estimatedMinutes: 15, priority: 'high', done: true, isCompleted: true, position: 2, orderIndex: 2, day: 'Monday (1 hr)' }
      ]
    },
    {
      id: 'task-2',
      kind: 'task',
      area: 'Engineering',
      title: 'Solve 2 Medium Two-Pointer & Sliding Window Problems',
      description: 'Focus on LeetCode patterns for Subarrays and String anagrams.',
      day: 'Tuesday (1 hr)',
      minutes: 60,
      estimatedMinutes: 60,
      priority: 'high',
      done: false,
      isCompleted: false,
      position: 1,
      orderIndex: 1,
      deadlineType: 'SOFT',
      isChunkable: true,
      scheduleStatus: 'scheduled',
      categoryEmoji: '💻',
      subtasks: [
        { id: 'sub-2a', kind: 'task', area: 'Engineering', title: 'Longest Substring Without Repeating Characters', description: 'Set/map index tracking', minutes: 30, estimatedMinutes: 30, priority: 'high', done: false, isCompleted: false, position: 0, orderIndex: 0, day: 'Tuesday (1 hr)' },
        { id: 'sub-2b', kind: 'task', area: 'Engineering', title: 'Container With Most Water', description: 'Greedy inward pointer convergence', minutes: 30, estimatedMinutes: 30, priority: 'high', done: false, isCompleted: false, position: 1, orderIndex: 1, day: 'Tuesday (1 hr)' }
      ]
    },
    {
      id: 'task-3',
      kind: 'block',
      area: 'Focus',
      startTime: '19:00',
      endTime: '20:00',
      title: 'Focus Block: Graph Traversals & Dynamic Programming',
      description: 'Protected distraction-free window to implement Topological sort and memoization templates.',
      day: 'Wednesday (1 hr)',
      minutes: 60,
      estimatedMinutes: 60,
      priority: 'medium',
      done: false,
      isCompleted: false,
      position: 2,
      orderIndex: 2,
      deadlineType: 'SOFT',
      isChunkable: false,
      scheduleStatus: 'scheduled',
      categoryEmoji: '📊'
    },
    {
      id: 'task-4',
      kind: 'event',
      area: 'Behavioral',
      startTime: '16:00',
      endTime: '16:45',
      title: 'Mock Technical Interview Session',
      description: 'Live pair mock interview with peer covering System Design and communication.',
      day: 'Thursday (45m)',
      minutes: 45,
      estimatedMinutes: 45,
      priority: 'high',
      done: false,
      isCompleted: false,
      position: 3,
      orderIndex: 3,
      deadlineType: 'HARD',
      isChunkable: false,
      scheduleStatus: 'scheduled',
      categoryEmoji: '🎙️'
    },
    {
      id: 'task-5',
      kind: 'task',
      area: 'Behavioral',
      title: 'Behavioral Stories (STAR Method) & Final Warm-up',
      description: 'Structure 3 impact stories (Conflict, Leadership, Technical challenge).',
      day: 'Friday (1 hr)',
      minutes: 60,
      estimatedMinutes: 60,
      priority: 'medium',
      done: false,
      isCompleted: false,
      position: 4,
      orderIndex: 4,
      deadlineType: 'SOFT',
      isChunkable: false,
      scheduleStatus: 'scheduled',
      categoryEmoji: '🗣️'
    },
    {
      id: 'task-6',
      kind: 'marker',
      area: 'Milestone',
      dueDate: 'Friday 17:00',
      title: 'Candidate Availability & Portal Submission Deadline',
      description: 'Non-blocking context milestone: ensure interview slot preferences are locked in.',
      day: 'Friday (Deadline)',
      minutes: 0,
      estimatedMinutes: 0,
      priority: 'low',
      done: false,
      isCompleted: false,
      position: 5,
      orderIndex: 5,
      deadlineType: 'HARD',
      isChunkable: false,
      scheduleStatus: 'scheduled',
      categoryEmoji: '📍'
    }
  ]
};

// Check if backend is available and inject session headers
let demoFailNext = false;
export function setDemoFailNext(val: boolean) {
  demoFailNext = val;
}

async function tryFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20000); // 2.5s quick timeout for local backend check
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Session-Id': getSessionId(),
      ...((options?.headers as Record<string, string>) || {})
    };

    if (demoFailNext) {
      headers['X-Demo-Fail'] = 'next';
      demoFailNext = false;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch {
    // Return null to trigger smart simulation fallback
    return null;
  }
}

export const apiService = {
  // GET /api/health
  async getHealth(): Promise<{ ok: boolean }> {
    const remote = await tryFetch<{ ok: boolean }>('/api/health');
    return remote || { ok: true };
  },

  // POST /api/chat
  async sendChat(payload: ApiChatRequest): Promise<ApiChatResponse> {
    const remoteResult = await tryFetch<ApiChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: payload.message,
        conversation_id: payload.conversation_id,
        context: { plan: payload.context?.plan || payload.currentPlanState || null },
        client: {
          now: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        }
      })
    });

    if (remoteResult && remoteResult.ok) return remoteResult;

    // Smart Local AI Simulation handling PRD & API Contract scenarios
    const lower = payload.message.toLowerCase();

    // Default trace stages conforming to contract Section 2
    const defaultTrace: TraceStage[] = [
      { stage: 'heard', label: 'Heard', ms: 14, ok: true },
      { stage: 'understood', label: 'Understood', ms: 340, ok: true },
      { stage: 'tool', label: 'Prepared plan', tool: 'create_plan', ms: 410, ok: true },
      { stage: 'result', label: 'Ready', ms: 12, ok: true }
    ];

    // Scenario B: "Make the first day easier and add a mock interview"
    if (lower.includes('easier') || lower.includes('mock interview') || lower.includes('first day')) {
      const currentPlan = payload.context?.plan || payload.currentPlanState || INITIAL_INTERVIEW_PREP_PLAN;
      const updatedTasks = currentPlan.tasks.map((task, idx) => {
        if (idx === 0) {
          return {
            ...task,
            title: 'Light DS Review & Cheat Sheet Setup',
            description: 'Reduced workload: 30 minutes reviewing high-level DS syntax & complexities.',
            minutes: 30,
            estimatedMinutes: 30
          };
        }
        return task;
      });

      // Add Mock Interview Task
      const mockTask: Task = {
        id: `task-mock-${Date.now()}`,
        title: 'Peer Mock Coding Interview & Feedback',
        description: 'Simulated 45-minute live coding session with behavioral follow-up.',
        day: 'Thursday (1 hr)',
        minutes: 45,
        estimatedMinutes: 45,
        priority: 'high',
        done: false,
        isCompleted: false,
        position: 3.5,
        orderIndex: 3.5
      };

      updatedTasks.splice(3, 0, mockTask);

      const updatedPlan: Plan = {
        ...currentPlan,
        title: `${currentPlan.title} (Refined)`,
        tasks: updatedTasks,
        updated_at: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const changes: PlanChange[] = [
        {
          kind: 'changed',
          task_id: 'task-1',
          title: 'Review Core Data Structures & Complexities',
          detail: '60 -> 30 min'
        },
        {
          kind: 'added',
          task_id: null,
          title: 'Peer Mock Coding Interview & Feedback',
          detail: 'Thu · 45 min · High'
        }
      ];

      const proposedAction: ProposedAction = {
        id: `action_${Date.now()}`,
        kind: 'update_plan',
        plan_id: currentPlan.id,
        title: `Update "${currentPlan.title}"`,
        changes,
        status: 'awaiting_confirmation',
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      };

      return {
        ok: true,
        conversation_id: 'conv_update_mock',
        trace: [
          { stage: 'heard', label: 'Heard', ms: 12, ok: true },
          { stage: 'understood', label: 'Understood', ms: 420, ok: true },
          { stage: 'tool', label: 'Prepared a change', tool: 'propose_plan_update', ms: 480, ok: true },
          { stage: 'result', label: 'Ready', ms: 10, ok: true }
        ],
        message: {
          text: "I can make Monday lighter and add a mock interview on Thursday. Here's what would change.",
          spoken: "I can make Monday lighter and add a mock interview on Thursday."
        },
        plan: null,
        action: {
          id: proposedAction.id,
          type: 'update_plan',
          label: 'Awaiting Confirmation',
          description: 'This will shorten Day 1 to 30 minutes and add a Mock Interview on Thursday.',
          state: 'awaiting_confirmation',
          changes,
          payload: { plan: updatedPlan, taskId: mockTask.id, proposedAction }
        },
        suggestedFollowUps: [
          'Looks great, apply this to my plan',
          'What should I work on first?',
          'Cancel this change'
        ]
      };
    }

    // Scenario A: "Help me prepare for a software engineering interview on Friday..."
    if (lower.includes('interview') || lower.includes('software') || lower.includes('prepare')) {
      return {
        ok: true,
        conversation_id: 'conv_initial_prep',
        trace: defaultTrace,
        message: {
          text: "I've structured a 5-evening preparation plan for your software engineering interview this Friday. Each evening is scheduled for 60 minutes.",
          spoken: "I've structured a 5-evening preparation plan for your interview on Friday."
        },
        plan: INITIAL_INTERVIEW_PREP_PLAN,
        action: {
          id: `act-${Date.now()}`,
          type: 'create_plan',
          label: 'Plan Created',
          description: '5-Day Software Engineering Prep Plan created and loaded to canvas',
          state: 'completed',
          payload: INITIAL_INTERVIEW_PREP_PLAN
        },
        suggestedFollowUps: [
          'Make the first day easier and add a mock interview',
          'I only have 30 minutes today. Adjust my schedule',
          'Show me the tasks I haven’t completed'
        ]
      };
    }

    // Scenario C: "I only have 30 minutes today..." / Motion Auto-Cascade
    if (lower.includes('30 minutes') || lower.includes('adjust') || lower.includes('rebalance') || lower.includes('cascade')) {
      const currentPlan = payload.context?.plan || payload.currentPlanState || INITIAL_INTERVIEW_PREP_PLAN;
      const rebalancedPlan = apiService.rebalancePlan(currentPlan, 30);

      return {
        ok: true,
        trace: [
          { stage: 'heard', label: 'Heard', ms: 10, ok: true },
          { stage: 'understood', label: 'Understood', ms: 310, ok: true },
          { stage: 'tool', label: 'Rebalanced schedule', tool: 'propose_plan_update', ms: 290, ok: true },
          { stage: 'result', label: 'Ready', ms: 8, ok: true }
        ],
        message: {
          text: "I've adjusted your schedule: Tuesday is capped at 30 minutes. The problem set was split into two 30-minute blocks, with Part 2 shifted to Wednesday.",
          spoken: "I adjusted Tuesday to 30 minutes and shifted Part 2 to Wednesday."
        },
        plan: rebalancedPlan,
        action: {
          id: `act-${Date.now()}`,
          type: 'reschedule_plan',
          label: 'Schedule Adjusted',
          description: 'Chunked Tuesday into 30m sprint and bumped Part 2 to Wednesday',
          state: 'completed',
          payload: rebalancedPlan
        },
        suggestedFollowUps: [
          'Review workload capacity',
          'Restore full 60m schedule',
          'Start daily shutdown'
        ]
      };
    }

    // Motion Cascade: Restore full 60m schedule
    if (lower.includes('restore') || lower.includes('full 60m')) {
      return {
        ok: true,
        trace: defaultTrace,
        message: {
          text: "Restored full 60-minute daily schedule across all 5 sprint days. All chunked segments have been consolidated.",
          spoken: "Restored standard 60-minute daily schedule."
        },
        plan: INITIAL_INTERVIEW_PREP_PLAN,
        action: {
          id: `act-${Date.now()}`,
          type: 'reschedule_plan',
          label: 'Schedule Restored',
          description: 'Restored standard 60-minute daily capacity',
          state: 'completed',
          payload: INITIAL_INTERVIEW_PREP_PLAN
        },
        suggestedFollowUps: [
          'I only have 30 minutes today. Adjust my schedule',
          'Review workload capacity',
          'Start planning ritual'
        ]
      };
    }

    // Sunsama Pattern 1: Guided Planning Ritual
    if (lower.includes('ritual') || lower.includes('planning ritual')) {
      return {
        ok: true,
        trace: defaultTrace,
        message: {
          text: "Starting your Guided Planning Ritual. You currently have 6 items in this sprint across Engineering and Behavioral tracks. Monday is calibrated to exactly 60 minutes. Review your items on the canvas and lock in your intention.",
          spoken: "Starting your guided planning ritual. Review your items on the canvas."
        },
        suggestedFollowUps: [
          'Review workload capacity',
          'Make the first day easier',
          'Start daily shutdown'
        ]
      };
    }

    // Sunsama Pattern 2: Workload Capacity Check
    if (lower.includes('capacity') || lower.includes('workload')) {
      return {
        ok: true,
        trace: defaultTrace,
        message: {
          text: "Workload Capacity Math: Your daily evening target is 60 minutes. You have 60 minutes of active focused work scheduled for tonight (100% of capacity). You are in a healthy, sustainable focus zone.",
          spoken: "Your evening target is 60 minutes. Workload is balanced."
        },
        suggestedFollowUps: [
          'What should I work on first?',
          'Make the first day easier',
          'Start daily shutdown'
        ]
      };
    }

    // Sunsama Pattern 3: Daily Shutdown
    if (lower.includes('shutdown') || lower.includes('wrap up')) {
      return {
        ok: true,
        trace: defaultTrace,
        message: {
          text: "Daily Shutdown Ritual: You completed 1 core task tonight. 5 items remain scheduled for the rest of the week. Shutting down until tomorrow evening.",
          spoken: "Daily shutdown complete. See you tomorrow evening."
        },
        action: {
          id: `act-${Date.now()}`,
          type: 'update_plan',
          label: 'Daily Shutdown Completed',
          description: 'Logged 60m focus time and safely deferred remaining milestones to tomorrow',
          state: 'completed'
        },
        suggestedFollowUps: [
          'Start planning ritual',
          'Show my saved plans'
        ]
      };
    }

    // Default conversational reply
    return {
      ok: true,
      trace: defaultTrace,
      message: {
        text: 'I can help you structure that into concrete tasks, schedule daily milestones, or revise any existing plan. Tell me the goal and how much time you have.',
        spoken: 'Tell me the goal and how much time you have. I will build the plan.'
      },
      suggestedFollowUps: [
        'Help me prepare for a software engineering interview on Friday. I have one hour each evening.',
        'Plan a 3-day weekend hackathon project'
      ]
    };
  },

  // POST /api/actions/:id/confirm
  async confirmAction(actionId: string, payload?: any): Promise<{ ok: boolean; action_id: string; status: string; plan?: Plan; summary?: string }> {
    const remote = await tryFetch<{ ok: boolean; action_id: string; status: string; plan: Plan; summary: string }>(
      `/api/actions/${actionId}/confirm`,
      { method: 'POST' }
    );
    if (remote && remote.ok) return remote;

    // Local fallback
    const targetPlan = payload?.plan || INITIAL_INTERVIEW_PREP_PLAN;
    await this.savePlan(targetPlan);
    return {
      ok: true,
      action_id: actionId,
      status: 'completed',
      plan: targetPlan,
      summary: 'Monday is now 30 minutes. Added Peer Mock Coding Interview on Thursday.'
    };
  },

  // POST /api/actions/:id/cancel
  async cancelAction(actionId: string): Promise<{ ok: boolean; status: string }> {
    const remote = await tryFetch<{ ok: boolean; status: string }>(`/api/actions/${actionId}/cancel`, {
      method: 'POST'
    });
    return remote || { ok: true, status: 'dismissed' };
  },

  // Motion Auto-Cascade Scheduling Engine
  rebalancePlan(plan: Plan, targetMinutesToday: number = 30): Plan {
    const updatedTasks: Task[] = [];

    for (const task of plan.tasks) {
      if (task.done || task.isCompleted || task.kind === 'marker' || task.deadlineType === 'HARD') {
        updatedTasks.push(task);
        continue;
      }

      if (task.id === 'task-2' && (task.minutes || task.estimatedMinutes || 60) > targetMinutesToday) {
        if (task.isChunkable) {
          const chunk1: Task = {
            ...task,
            id: `${task.id}-chunk-1`,
            title: `${task.title} (Part 1/2)`,
            day: `Tuesday (${targetMinutesToday}m)`,
            minutes: targetMinutesToday,
            estimatedMinutes: targetMinutesToday,
            chunkPart: 1,
            totalChunks: 2,
            scheduleStatus: 'scheduled',
            subtasks: task.subtasks ? [task.subtasks[0]] : undefined
          };

          const chunk2: Task = {
            ...task,
            id: `${task.id}-chunk-2`,
            title: `${task.title} (Part 2/2)`,
            day: 'Wednesday (30m)',
            minutes: (task.minutes || task.estimatedMinutes || 60) - targetMinutesToday,
            estimatedMinutes: (task.minutes || task.estimatedMinutes || 60) - targetMinutesToday,
            chunkPart: 2,
            totalChunks: 2,
            scheduleStatus: 'bumped',
            bumpedFrom: 'Tuesday',
            subtasks: task.subtasks ? [task.subtasks[1]] : undefined
          };

          updatedTasks.push(chunk1, chunk2);
        } else {
          updatedTasks.push({
            ...task,
            day: 'Wednesday (1 hr)',
            scheduleStatus: 'bumped',
            bumpedFrom: 'Tuesday'
          });
        }
      } else {
        updatedTasks.push(task);
      }
    }

    return {
      ...plan,
      dailyCapacityMinutes: targetMinutesToday,
      tasks: updatedTasks,
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  // GET /api/plans
  async getPlans(): Promise<Plan[]> {
    const remote = await tryFetch<{ ok: boolean; plans: PlanSummary[] | Plan[] }>('/api/plans');
    if (remote && remote.ok && Array.isArray(remote.plans)) {
      return remote.plans as Plan[];
    }
    const local = localStorage.getItem('daybridge_saved_plans');
    return local ? JSON.parse(local) : [INITIAL_INTERVIEW_PREP_PLAN];
  },

  // GET /api/plans/:id
  async getPlanById(id: string): Promise<Plan | null> {
    const remote = await tryFetch<{ ok: boolean; plan: Plan }>(`/api/plans/${id}`);
    if (remote && remote.ok) return remote.plan;
    const plans = await this.getPlans();
    return plans.find((p) => p.id === id) || null;
  },

  // POST /api/plans
  async savePlan(plan: Plan): Promise<Plan> {
    const remote = await tryFetch<{ ok: boolean; plan: Plan }>('/api/plans', {
      method: 'POST',
      body: JSON.stringify({ plan })
    });
    if (remote && remote.ok) return remote.plan;

    const existing = await this.getPlans();
    const updated = existing.some((p) => p.id === plan.id)
      ? existing.map((p) => (p.id === plan.id ? plan : p))
      : [plan, ...existing];
    localStorage.setItem('daybridge_saved_plans', JSON.stringify(updated));
    return plan;
  },

  // PATCH /api/plans/:id
  async updatePlan(id: string, updates: { title?: string; objective?: string }): Promise<Plan | null> {
    const remote = await tryFetch<{ ok: boolean; plan: Plan }>(`/api/plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    if (remote && remote.ok) return remote.plan;

    const plans = await this.getPlans();
    const plan = plans.find((p) => p.id === id);
    if (!plan) return null;
    const updatedPlan: Plan = { ...plan, ...updates, updated_at: new Date().toISOString() };
    await this.savePlan(updatedPlan);
    return updatedPlan;
  },

  // DELETE /api/plans/:id
  async deletePlan(planId: string): Promise<boolean> {
    const remote = await tryFetch<{ ok: boolean; deleted_id: string }>(`/api/plans/${planId}`, {
      method: 'DELETE'
    });
    if (remote && remote.ok) return true;

    const existing = await this.getPlans();
    const filtered = existing.filter((p) => p.id !== planId);
    localStorage.setItem('daybridge_saved_plans', JSON.stringify(filtered));
    return true;
  },

  // PATCH /api/tasks/:id
  async updateTask(
    taskId: string,
    updates: Partial<Task>
  ): Promise<{ ok: boolean; task?: Task; progress?: { done: number; total: number; minutes_left: number } }> {
    const remote = await tryFetch<{
      ok: boolean;
      task: Task;
      progress: { done: number; total: number; minutes_left: number };
    }>(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    if (remote && remote.ok) return remote;

    return {
      ok: true,
      progress: { done: 1, total: 6, minutes_left: 225 }
    };
  },

  // POST /api/plans/:id/tasks
  async addTask(
    planId: string,
    taskData: { title: string; description?: string; day: string; minutes: number; priority: 'high' | 'medium' | 'low' }
  ): Promise<{ ok: boolean; task?: Task; plan?: Plan }> {
    const remote = await tryFetch<{ ok: boolean; task: Task; plan: Plan }>(`/api/plans/${planId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
    if (remote && remote.ok) return remote;

    const plan = await this.getPlanById(planId);
    if (!plan) return { ok: false };
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      day: taskData.day,
      minutes: taskData.minutes,
      estimatedMinutes: taskData.minutes,
      priority: taskData.priority,
      done: false,
      isCompleted: false,
      position: plan.tasks.length,
      orderIndex: plan.tasks.length
    };
    const updatedPlan: Plan = {
      ...plan,
      tasks: [...plan.tasks, newTask],
      updated_at: new Date().toISOString()
    };
    await this.savePlan(updatedPlan);
    return { ok: true, task: newTask, plan: updatedPlan };
  },

  // DELETE /api/tasks/:id
  async deleteTask(taskId: string, planId?: string): Promise<{ ok: boolean; deleted_id?: string; plan?: Plan }> {
    const remote = await tryFetch<{ ok: boolean; deleted_id: string; plan: Plan }>(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    });
    if (remote && remote.ok) return remote;

    if (!planId) return { ok: true, deleted_id: taskId };
    const plan = await this.getPlanById(planId);
    if (!plan) return { ok: true, deleted_id: taskId };
    const updatedPlan: Plan = {
      ...plan,
      tasks: plan.tasks.filter((t) => t.id !== taskId),
      updated_at: new Date().toISOString()
    };
    await this.savePlan(updatedPlan);
    return { ok: true, deleted_id: taskId, plan: updatedPlan };
  }
};
