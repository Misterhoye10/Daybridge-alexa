export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  parentId?: string;
  planId?: string;
  title: string;
  description: string;
  day?: string; // e.g. "Monday", "Day 1", "Evening 1"
  dueDate?: string;
  priority?: TaskPriority;
  estimatedMinutes?: number;
  isCompleted: boolean;
  orderIndex: number;
  categoryEmoji?: string;
  subtasks?: Task[];
}

export interface Plan {
  id: string;
  title: string;
  summary: string;
  objective?: string;
  createdAt: string;
  updatedAt: string;
  granularity?: number; // 1 (macro) to 5 (micro-steps)
  tasks: Task[];
  completionPercentage?: number;
}

export type ActionExecutionState = 
  | 'suggested'             // AI proposes a change, shown to user with "Apply" / "Review"
  | 'awaiting_confirmation' // Destructive or major action requiring explicit confirmation
  | 'completed'             // Executed and persisted
  | 'failed';               // Execution failed with error message

export interface AssistantAction {
  id: string;
  type: 'create_plan' | 'update_plan' | 'add_task' | 'update_task' | 'complete_task' | 'delete_plan' | 'reschedule_plan';
  label: string;
  description: string;
  state: ActionExecutionState;
  payload?: any;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  action?: AssistantAction;
  plan?: Plan; // Attached structured plan snapshot if generated/updated
}

export interface ApiChatRequest {
  message: string;
  sessionId?: string;
  currentPlanId?: string;
  currentPlanState?: Plan;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ApiChatResponse {
  message: string;
  plan?: Plan;
  action?: AssistantAction;
  suggestedFollowUps?: string[];
}
