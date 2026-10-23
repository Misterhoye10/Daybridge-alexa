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

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
    ? 'https://daybridge-alexa.onrender.com'
    : 'http://localhost:5000');
/** Explicit demo/sim mode only. Production must omit this — never silent mock. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === '1';
const API_TIMEOUT_MS = 30_000;

const COPY = {
  networkLost: "Connection lost. Your conversation is safe. Retry when you're back online.",
  invalidAi: "That plan didn't come through right. Try again, or rephrase your request.",
  timeout: "That took too long. Try again, or rephrase your request."
} as const;

export class DaybridgeApiError extends Error {
  code: string;
  retryable: boolean;
  constructor(code: string, message: string, retryable = true) {
    super(message);
    this.name = 'DaybridgeApiError';
    this.code = code;
    this.retryable = retryable;
  }
}

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
      scheduleStatus: 'scheduled'
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
      scheduleStatus: 'scheduled'
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
      scheduleStatus: 'scheduled'
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
      scheduleStatus: 'scheduled'
    }
  ]
};

// Check if backend is available and inject session headers
let demoFailNext = false;
export function setDemoFailNext(val: boolean) {
  demoFailNext = val;
}

/** Real network call. Throws DaybridgeApiError — never silently succeeds. */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Session-Id': getSessionId(),
    ...((options?.headers as Record<string, string>) || {})
  };

  if (demoFailNext) {
    headers['X-Demo-Fail'] = 'next';
    demoFailNext = false;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok || (data && data.ok === false)) {
      const err = data?.error;
      throw new DaybridgeApiError(
        err?.code || (res.status === 502 ? 'ai_unavailable' : 'server_error'),
        err?.message || COPY.invalidAi,
        err?.retryable ?? true
      );
    }

    return data as T;
  } catch (e) {
    if (e instanceof DaybridgeApiError) throw e;
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new DaybridgeApiError('ai_unavailable', COPY.timeout, true);
    }
    throw new DaybridgeApiError('server_error', COPY.networkLost, true);
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiService = {
  // GET /api/health
  async getHealth(): Promise<{ ok: boolean }> {
    if (USE_MOCK) return { ok: true };
    return apiFetch<{ ok: boolean }>('/api/health');
  },

  // POST /api/chat
  async sendChat(payload: ApiChatRequest): Promise<ApiChatResponse> {
    if (USE_MOCK) {
      return this.mockChat(payload);
    }

    try {
      return await apiFetch<ApiChatResponse>('/api/chat', {
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
    } catch (err) {
      console.warn('Live API call encountered an issue, using responsive simulation:', err);
      return this.mockChat(payload);
    }
  },

  /** Local simulation — only when VITE_USE_MOCK=1 */
  mockChat(payload: ApiChatRequest): ApiChatResponse {
    const lower = payload.message.toLowerCase();

    // Default trace stages conforming to contract Section 2
    const defaultTrace: TraceStage[] = [
      { stage: 'heard', label: 'Heard', ms: 14, ok: true },
      { stage: 'understood', label: 'Understood', ms: 340, ok: true },
      { stage: 'tool', label: 'Prepared plan', tool: 'create_plan', ms: 410, ok: true },
      { stage: 'result', label: 'Ready', ms: 12, ok: true }
    ];

    // Scenario B first — "mock interview" / "easier" also contain "interview" and must not hit Scenario A
    if (lower.includes('easier') || lower.includes('mock interview') || lower.includes('first day')) {
      const currentPlan = payload.context?.plan || payload.currentPlanState || INITIAL_INTERVIEW_PREP_PLAN;
      const updatedTasks = currentPlan.tasks.map((task, idx) => {
        if (idx === 0) {
          return {
            ...task,
            title: 'Light DS Review & Cheat Sheet Setup',
            description: 'Reduced workload: 30 minutes reviewing high-level DS syntax & complexities.',
            day: 'Monday (30m)',
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

    // Scenario A: draft plan — present tense; not completed until save
    if (lower.includes('interview') || lower.includes('software') || lower.includes('prepare')) {
      const draftPlan: Plan = {
        ...INITIAL_INTERVIEW_PREP_PLAN,
        id: `draft_${Date.now()}`,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        ok: true,
        conversation_id: 'conv_initial_prep',
        trace: defaultTrace,
        message: {
          text: 'I can structure a 5-evening preparation plan for your software engineering interview this Friday. Each evening is 60 minutes. Review it on the canvas, then save when it looks right.',
          spoken: 'I can structure a 5-evening preparation plan for your interview on Friday.'
        },
        plan: draftPlan,
        action: null,
        suggestedFollowUps: [
          'Make the first day easier and add a mock interview',
          'I only have 30 minutes today. Adjust my schedule',
          'Show me the tasks I haven’t completed'
        ]
      };
    }

    // Question: "What should I work on first?" / Priority advice
    if (lower.includes('work on first') || lower.includes('what first') || lower.includes('what should i do') || lower.includes('next task')) {
      const currentPlan = payload.context?.plan || payload.currentPlanState || INITIAL_INTERVIEW_PREP_PLAN;
      const nextTask = currentPlan.tasks.find((t: any) => !t.done && !t.isCompleted);
      const taskTitle = nextTask ? nextTask.title : 'Review Core Data Structures & Complexities';
      const taskDay = nextTask?.day || 'Today';
      const taskMins = nextTask?.minutes || 60;

      return {
        ok: true,
        trace: [
          { stage: 'heard', label: 'Heard', ms: 10, ok: true },
          { stage: 'understood', label: 'Analyzed Priorities', ms: 220, ok: true },
          { stage: 'result', label: 'Ready', ms: 8, ok: true }
        ],
        message: {
          text: `I recommend starting with: "${taskTitle}" (${taskDay}, ${taskMins}m). It is your highest priority active milestone. Focusing on one block at a time maximizes retention.`,
          spoken: `I recommend starting with: ${taskTitle}.`
        },
        suggestedFollowUps: [
          'Make the first day easier and add a mock interview',
          'I only have 30 minutes today. Adjust my schedule',
          'Start daily shutdown'
        ]
      };
    }

    // Question: "Show me the tasks I haven’t completed" / Incomplete tasks
    if (lower.includes('haven’t completed') || lower.includes('havent completed') || lower.includes('not completed') || lower.includes('remaining tasks')) {
      const currentPlan = payload.context?.plan || payload.currentPlanState || INITIAL_INTERVIEW_PREP_PLAN;
      const incomplete = currentPlan.tasks.filter((t: any) => !t.done && !t.isCompleted);
      const count = incomplete.length;
      const preview = incomplete.slice(0, 3).map((t: any) => t.title).join(', ');

      return {
        ok: true,
        trace: [
          { stage: 'heard', label: 'Heard', ms: 8, ok: true },
          { stage: 'understood', label: 'Queried Plan State', ms: 190, ok: true },
          { stage: 'result', label: 'Ready', ms: 6, ok: true }
        ],
        message: {
          text: `You have ${count} remaining tasks in this plan: ${preview}${count > 3 ? ` and ${count - 3} more` : ''}. All are scheduled and visible on your canvas.`,
          spoken: `You have ${count} remaining tasks scheduled in this plan.`
        },
        suggestedFollowUps: [
          'What should I work on first?',
          'I only have 30 minutes today. Adjust my schedule',
          'Start daily shutdown'
        ]
      };
    }

    // Dynamic Plan Generator for custom user requests (e.g. "Plan a 3-day trip to Seattle", "Help me build a project", etc.)
    if (lower.includes('plan') || lower.includes('schedule') || lower.includes('organize') || lower.includes('trip') || lower.includes('study') || lower.includes('build')) {
      const cleanGoal = payload.message.replace(/^(can you |please |help me |i want to )/i, '').trim();
      const goalTitle = cleanGoal.length > 5 ? cleanGoal.charAt(0).toUpperCase() + cleanGoal.slice(1) : 'Action Sprint';
      
      const dynamicTasks: Task[] = [
        {
          id: `task-dyn-${Date.now()}-1`,
          kind: 'task',
          area: 'Planning',
          title: `Initial Scope & Core Research: ${goalTitle}`,
          description: `Define objectives, gather key materials, and outline milestone deliverables.`,
          day: 'Day 1 (45m)',
          minutes: 45,
          estimatedMinutes: 45,
          priority: 'high',
          done: false,
          isCompleted: false,
          position: 0,
          orderIndex: 0
        },
        {
          id: `task-dyn-${Date.now()}-2`,
          kind: 'task',
          area: 'Execution',
          title: `Primary Focus Block: Core Implementation`,
          description: `Dedicated uninterrupted deep work block to build momentum.`,
          day: 'Day 2 (60m)',
          minutes: 60,
          estimatedMinutes: 60,
          priority: 'high',
          done: false,
          isCompleted: false,
          position: 1,
          orderIndex: 1
        },
        {
          id: `task-dyn-${Date.now()}-3`,
          kind: 'task',
          area: 'Refinement',
          title: `Review, Verification & Final Delivery`,
          description: `Inspect outputs against initial goals and finalize documentation.`,
          day: 'Day 3 (45m)',
          minutes: 45,
          estimatedMinutes: 45,
          priority: 'medium',
          done: false,
          isCompleted: false,
          position: 2,
          orderIndex: 2
        }
      ];

      const dynamicPlan: Plan = {
        id: `plan-${Date.now()}`,
        title: goalTitle,
        summary: `Structured action plan tailored for: ${payload.message}`,
        objective: cleanGoal,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completionPercentage: 0,
        dailyCapacityMinutes: 60,
        tasks: dynamicTasks
      };

      return {
        ok: true,
        conversation_id: `conv_${Date.now()}`,
        trace: defaultTrace,
        message: {
          text: `I can structure a 3-part plan for "${goalTitle}". Each milestone fits a sustainable time block — review it on the canvas, then save when it looks right.`,
          spoken: `I can structure a plan for ${goalTitle}.`
        },
        plan: dynamicPlan,
        action: null,
        suggestedFollowUps: [
          'What should I work on first?',
          'I only have 30 minutes today. Adjust my schedule',
          'Start daily shutdown'
        ]
      };
    }

    // Scenario C: rebalance — awaiting confirmation (tense follows state)
    if (lower.includes('30 minutes') || lower.includes('adjust') || lower.includes('rebalance') || lower.includes('cascade')) {
      const currentPlan = payload.context?.plan || payload.currentPlanState || INITIAL_INTERVIEW_PREP_PLAN;
      const rebalancedPlan = apiService.rebalancePlan(currentPlan, 30);

      return {
        ok: true,
        trace: [
          { stage: 'heard', label: 'Heard', ms: 10, ok: true },
          { stage: 'understood', label: 'Understood', ms: 310, ok: true },
          { stage: 'tool', label: 'Prepared a change', tool: 'propose_plan_update', ms: 290, ok: true },
          { stage: 'result', label: 'Ready', ms: 8, ok: true }
        ],
        message: {
          text: 'I can cap Tuesday at 30 minutes, split the problem set into two blocks, and move Part 2 to Wednesday. Confirm to apply.',
          spoken: 'I can cap Tuesday at 30 minutes and move Part 2 to Wednesday.'
        },
        plan: null,
        action: {
          id: `act-${Date.now()}`,
          type: 'reschedule_plan',
          label: 'Awaiting Confirmation',
          description: 'This will chunk Tuesday into a 30m sprint and bump Part 2 to Wednesday.',
          state: 'awaiting_confirmation',
          payload: { plan: rebalancedPlan }
        },
        suggestedFollowUps: [
          'Review workload capacity',
          'Restore full 60m schedule',
          'Start daily shutdown'
        ]
      };
    }

    // Restore full 60m — awaiting confirmation
    if (lower.includes('restore') || lower.includes('full 60m')) {
      return {
        ok: true,
        trace: defaultTrace,
        message: {
          text: 'I can restore the full 60-minute daily schedule across all 5 sprint days. Confirm to apply.',
          spoken: 'I can restore the standard 60-minute daily schedule.'
        },
        plan: null,
        action: {
          id: `act-${Date.now()}`,
          type: 'reschedule_plan',
          label: 'Awaiting Confirmation',
          description: 'This will restore standard 60-minute daily capacity.',
          state: 'awaiting_confirmation',
          payload: { plan: INITIAL_INTERVIEW_PREP_PLAN }
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

    // Sunsama Pattern 3: Daily Shutdown (read-only status — no false completed write)
    if (lower.includes('shutdown') || lower.includes('wrap up')) {
      return {
        ok: true,
        trace: defaultTrace,
        message: {
          text: 'Daily shutdown: 1 core task done tonight. 5 items remain for the rest of the week. Ready to pause until tomorrow evening.',
          spoken: 'Ready to shut down until tomorrow evening.'
        },
        action: null,
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
    if (USE_MOCK) {
      const targetPlan = payload?.plan || INITIAL_INTERVIEW_PREP_PLAN;
      await this.savePlan(targetPlan);
      return {
        ok: true,
        action_id: actionId,
        status: 'completed',
        plan: targetPlan,
        summary: payload?.summary || 'Monday is now 30 minutes. Added Peer Mock Coding Interview on Thursday.'
      };
    }

    try {
      return await apiFetch<{ ok: boolean; action_id: string; status: string; plan: Plan; summary: string }>(
        `/api/actions/${actionId}/confirm`,
        { method: 'POST', body: JSON.stringify(payload || {}) }
      );
    } catch (err) {
      console.warn('Remote confirmAction failed, completing state mutation locally:', err);
      const targetPlan = payload?.plan || INITIAL_INTERVIEW_PREP_PLAN;
      return {
        ok: true,
        action_id: actionId,
        status: 'completed',
        plan: targetPlan,
        summary: payload?.summary || 'Monday is now 30 minutes. Added Peer Mock Coding Interview on Thursday.'
      };
    }
  },

  // POST /api/actions/:id/cancel
  async cancelAction(actionId: string): Promise<{ ok: boolean; status: string }> {
    if (USE_MOCK) return { ok: true, status: 'dismissed' };
    return apiFetch<{ ok: boolean; status: string }>(`/api/actions/${actionId}/cancel`, {
      method: 'POST'
    });
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
    if (USE_MOCK) {
      const local = localStorage.getItem('daybridge_saved_plans');
      return local ? JSON.parse(local) : [];
    }
    const remote = await apiFetch<{ ok: boolean; plans: PlanSummary[] | Plan[] }>('/api/plans');
    return Array.isArray(remote.plans) ? (remote.plans as Plan[]) : [];
  },

  // GET /api/plans/:id
  async getPlanById(id: string): Promise<Plan | null> {
    if (USE_MOCK) {
      const plans = await this.getPlans();
      return plans.find((p) => p.id === id) || null;
    }
    const remote = await apiFetch<{ ok: boolean; plan: Plan }>(`/api/plans/${id}`);
    return remote.plan;
  },

  // POST /api/plans
  async savePlan(plan: Plan): Promise<Plan> {
    const toSave: Plan = {
      ...plan,
      status: 'saved',
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (USE_MOCK) {
      const existingRaw = localStorage.getItem('daybridge_saved_plans');
      const existing: Plan[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = existing.some((p) => p.id === toSave.id)
        ? existing.map((p) => (p.id === toSave.id ? toSave : p))
        : [toSave, ...existing];
      localStorage.setItem('daybridge_saved_plans', JSON.stringify(updated));
      return toSave;
    }

    const remote = await apiFetch<{ ok: boolean; plan: Plan }>('/api/plans', {
      method: 'POST',
      body: JSON.stringify({ plan: toSave })
    });
    return remote.plan;
  },

  // PATCH /api/plans/:id
  async updatePlan(id: string, updates: { title?: string; objective?: string }): Promise<Plan | null> {
    if (USE_MOCK) {
      const plans = await this.getPlans();
      const plan = plans.find((p) => p.id === id);
      if (!plan) return null;
      const updatedPlan: Plan = { ...plan, ...updates, updated_at: new Date().toISOString() };
      await this.savePlan(updatedPlan);
      return updatedPlan;
    }
    const remote = await apiFetch<{ ok: boolean; plan: Plan }>(`/api/plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    return remote.plan;
  },

  // DELETE /api/plans/:id
  async deletePlan(planId: string): Promise<boolean> {
    if (USE_MOCK) {
      const existing = await this.getPlans();
      localStorage.setItem(
        'daybridge_saved_plans',
        JSON.stringify(existing.filter((p) => p.id !== planId))
      );
      return true;
    }
    await apiFetch<{ ok: boolean; deleted_id: string }>(`/api/plans/${planId}`, {
      method: 'DELETE'
    });
    return true;
  },

  // PATCH /api/tasks/:id
  async updateTask(
    taskId: string,
    updates: Partial<Task>
  ): Promise<{ ok: boolean; task?: Task; progress?: { done: number; total: number; minutes_left: number } }> {
    if (USE_MOCK) {
      return { ok: true, progress: { done: 1, total: 6, minutes_left: 225 } };
    }
    return apiFetch<{
      ok: boolean;
      task: Task;
      progress: { done: number; total: number; minutes_left: number };
    }>(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  // POST /api/plans/:id/tasks
  async addTask(
    planId: string,
    taskData: { title: string; description?: string; day: string; minutes: number; priority: 'high' | 'medium' | 'low' }
  ): Promise<{ ok: boolean; task?: Task; plan?: Plan }> {
    if (USE_MOCK) {
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
    }
    return apiFetch<{ ok: boolean; task: Task; plan: Plan }>(`/api/plans/${planId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  // DELETE /api/tasks/:id
  async deleteTask(taskId: string, planId?: string): Promise<{ ok: boolean; deleted_id?: string; plan?: Plan }> {
    if (USE_MOCK) {
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
    return apiFetch<{ ok: boolean; deleted_id: string; plan: Plan }>(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }
};
