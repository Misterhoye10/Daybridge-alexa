import type { Plan, Task, ApiChatRequest, ApiChatResponse } from '../types/daybridge';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Initial flagship mock data following PRD Section 10 Primary Demonstration Scenario
export const INITIAL_INTERVIEW_PREP_PLAN: Plan = {
  id: 'plan-swe-interview-prep',
  title: 'Software Engineering Interview Prep',
  summary: 'A structured 5-day preparation sprint allocating 1 focused hour each evening until Friday.',
  objective: 'Ace technical coding and behavioral rounds through systematic review.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  completionPercentage: 20,
  tasks: [
    {
      id: 'task-1',
      title: 'Review Core Data Structures & Complexities',
      description: 'Brush up on Arrays, Hash Tables, Trees, and Big-O trade-offs.',
      day: 'Monday (1 hr)',
      priority: 'high',
      estimatedMinutes: 60,
      isCompleted: true,
      orderIndex: 0
    },
    {
      id: 'task-2',
      title: 'Solve 2 Medium Two-Pointer & Sliding Window Problems',
      description: 'Focus on LeetCode patterns for Subarrays and String anagrams.',
      day: 'Tuesday (1 hr)',
      priority: 'high',
      estimatedMinutes: 60,
      isCompleted: false,
      orderIndex: 1
    },
    {
      id: 'task-3',
      title: 'Dynamic Programming & Graph Traversals (DFS/BFS)',
      description: 'Implement Topological sort and standard 1D memoization templates.',
      day: 'Wednesday (1 hr)',
      priority: 'medium',
      estimatedMinutes: 60,
      isCompleted: false,
      orderIndex: 2
    },
    {
      id: 'task-4',
      title: 'System Design Fundamentals & API Trade-offs',
      description: 'Review caching layers, database indexing, and rate-limiting patterns.',
      day: 'Thursday (1 hr)',
      priority: 'medium',
      estimatedMinutes: 60,
      isCompleted: false,
      orderIndex: 3
    },
    {
      id: 'task-5',
      title: 'Behavioral Stories (STAR Method) & Final Warm-up',
      description: 'Structure 3 impact stories (Conflict, Leadership, Technical challenge).',
      day: 'Friday (1 hr)',
      priority: 'high',
      estimatedMinutes: 60,
      isCompleted: false,
      orderIndex: 4
    }
  ]
};

// Check if backend is available
async function tryFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2500); // 2.5s quick timeout for local backend check
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    // Return null to trigger smart simulation fallback
    return null;
  }
}

export const apiService = {
  // POST /api/chat
  async sendChat(payload: ApiChatRequest): Promise<ApiChatResponse> {
    const remoteResult = await tryFetch<ApiChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (remoteResult) return remoteResult;

    // Smart Local AI Simulation handling PRD 10 scenarios
    const lower = payload.message.toLowerCase();

    // Scenario A: "Help me prepare for a software engineering interview on Friday..."
    if (lower.includes('interview') || lower.includes('software') || lower.includes('prepare')) {
      return {
        message: "I've structured a focused 5-evening preparation plan for your software engineering interview this Friday. Each evening is scheduled for exactly 60 minutes with prioritized milestones.",
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

    // Scenario B: "Make the first day easier and add a mock interview"
    if (lower.includes('easier') || lower.includes('mock interview') || lower.includes('first day')) {
      const currentPlan = payload.currentPlanState || INITIAL_INTERVIEW_PREP_PLAN;
      const updatedTasks = currentPlan.tasks.map((task, idx) => {
        if (idx === 0) {
          return {
            ...task,
            title: 'Light DS Review & Cheat Sheet Setup',
            description: 'Reduced workload: 30 minutes reviewing high-level DS syntax & complexities.',
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
        priority: 'high',
        estimatedMinutes: 45,
        isCompleted: false,
        orderIndex: 3.5
      };

      updatedTasks.splice(3, 0, mockTask);

      const updatedPlan: Plan = {
        ...currentPlan,
        title: `${currentPlan.title} (Refined)`,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString()
      };

      return {
        message: "I've updated your plan: Day 1 has been simplified to a lighter 30-minute review, and a high-priority 45-minute Mock Interview has been integrated into Thursday.",
        plan: updatedPlan,
        action: {
          id: `act-${Date.now()}`,
          type: 'update_plan',
          label: 'Suggested Modification',
          description: 'Eased Day 1 workload to 30 mins and inserted peer mock interview',
          state: 'suggested',
          payload: { plan: updatedPlan, taskId: mockTask.id }
        },
        suggestedFollowUps: [
          'Looks great, apply this to my plan',
          'What should I work on first?',
          'Save this plan'
        ]
      };
    }

    // Scenario C: "I only have 30 minutes today..."
    if (lower.includes('30 minutes') || lower.includes('adjust')) {
      return {
        message: "Adjusted for your 30-minute time constraint today: I've narrowed today's focus strictly to High-Priority Hash Table problem patterns. The remaining graph concepts have been deferred to tomorrow.",
        action: {
          id: `act-${Date.now()}`,
          type: 'reschedule_plan',
          label: 'Schedule Adjusted',
          description: 'Capped today at 30 minutes and rebalanced remaining tasks',
          state: 'completed'
        },
        suggestedFollowUps: [
          'What should I work on first?',
          'Show me unfinished tasks'
        ]
      };
    }

    // Default conversational reply
    return {
      message: `I understand. I can help you structure that into concrete tasks, schedule daily milestones, or revise any existing plan. Try asking: "Help me prepare for an interview" or "Plan a 3-day sprint".`,
      suggestedFollowUps: [
        'Help me prepare for a software engineering interview on Friday. I have one hour each evening.',
        'Plan a 3-day weekend hackathon project'
      ]
    };
  },

  // GET /api/plans
  async getPlans(): Promise<Plan[]> {
    const remote = await tryFetch<Plan[]>('/api/plans');
    if (remote) return remote;
    const local = localStorage.getItem('daybridge_saved_plans');
    return local ? JSON.parse(local) : [INITIAL_INTERVIEW_PREP_PLAN];
  },

  // POST /api/plans
  async savePlan(plan: Plan): Promise<Plan> {
    const remote = await tryFetch<Plan>('/api/plans', {
      method: 'POST',
      body: JSON.stringify(plan)
    });
    if (remote) return remote;

    const existing = await this.getPlans();
    const updated = existing.some((p) => p.id === plan.id)
      ? existing.map((p) => (p.id === plan.id ? plan : p))
      : [plan, ...existing];
    localStorage.setItem('daybridge_saved_plans', JSON.stringify(updated));
    return plan;
  },

  // DELETE /api/plans/:id
  async deletePlan(planId: string): Promise<boolean> {
    const remote = await tryFetch<{ success: boolean }>(`/api/plans/${planId}`, {
      method: 'DELETE'
    });
    if (remote?.success) return true;

    const existing = await this.getPlans();
    const filtered = existing.filter((p) => p.id !== planId);
    localStorage.setItem('daybridge_saved_plans', JSON.stringify(filtered));
    return true;
  }
};
