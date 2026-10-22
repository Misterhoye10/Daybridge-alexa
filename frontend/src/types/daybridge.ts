// Daybridge API Contract Types (per design/API_CONTRACT.md)

export type Priority = 'high' | 'medium' | 'low';
export type TaskPriority = Priority;

export type PlanItemKind = 'task' | 'block' | 'event' | 'marker';
export type DeadlineType = 'HARD' | 'SOFT' | 'NONE';
export type ScheduleStatus = 'scheduled' | 'in_progress' | 'completed' | 'at_risk' | 'bumped';

export interface Task {
  id: string;
  title: string;            // max 80 chars
  description: string;      // max 280 chars, may be empty
  day?: string;             // YYYY-MM-DD or human day label e.g. "Monday (1 hr)"
  minutes?: number;         // 5..180
  priority?: Priority;
  done?: boolean;
  position?: number;        // order within the plan

  // Backward compatibility & UI helper fields
  isCompleted?: boolean;
  estimatedMinutes?: number;
  orderIndex?: number;
  parentId?: string;
  planId?: string;
  kind?: PlanItemKind;
  area?: string;
  startTime?: string;
  endTime?: string;
  deadlineType?: DeadlineType;
  isChunkable?: boolean;
  chunkPart?: number;
  totalChunks?: number;
  scheduleStatus?: ScheduleStatus;
  bumpedFrom?: string;
  dueDate?: string;
  categoryEmoji?: string;
  subtasks?: Task[];
}

export interface Plan {
  id: string;               // drafts use "draft_<random>"
  title: string;            // max 80 chars
  objective: string;        // max 240 chars
  status: 'draft' | 'saved';
  tasks: Task[];            // max 12
  created_at: string;
  updated_at: string;

  // Backward compatibility & UI helper fields
  summary?: string;
  createdAt?: string;
  updatedAt?: string;
  completionPercentage?: number;
  dailyCapacityMinutes?: number;
  granularity?: number;
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

export type ActionExecutionState =
  | 'suggested'
  | 'awaiting_confirmation'
  | 'running'
  | 'completed'
  | 'failed'
  | 'dismissed';

export interface AssistantAction {
  id: string;
  type?: 'create_plan' | 'update_plan' | 'add_task' | 'update_task' | 'complete_task' | 'delete_plan' | 'reschedule_plan';
  kind?: 'update_plan';
  label?: string;
  title?: string;
  description?: string;
  state: ActionExecutionState;
  status?: 'awaiting_confirmation' | 'completed' | 'dismissed';
  plan_id?: string;
  expires_at?: string;
  changes?: PlanChange[];
  payload?: any;
  error?: string;
}

export interface ProposedAction {
  id: string;
  kind: 'update_plan';
  plan_id: string;
  title: string;
  changes: PlanChange[];
  status: 'awaiting_confirmation';
  expires_at: string;
  state?: ActionExecutionState;
}

export type ApiErrorCode =
  | 'validation_error'
  | 'not_found'
  | 'action_expired'
  | 'rate_limited'
  | 'invalid_ai_output'
  | 'ai_unavailable'
  | 'server_error'
  | 'demo_forced_failure';

export interface ApiError {
  code: ApiErrorCode | string;
  message: string;
  retryable: boolean;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: ApiError;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  spoken?: string;
  timestamp: string;
  trace?: TraceStage[];
  action?: AssistantAction;
  plan?: Plan;
  references?: string[];
}

export interface ApiChatRequest {
  message: string;
  conversation_id?: string;
  context?: {
    plan?: Plan | null;
  };
  client?: {
    now: string;
    timezone: string;
  };
  // Legacy fields
  sessionId?: string;
  currentPlanId?: string;
  currentPlanState?: Plan;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ApiChatResponse {
  ok: boolean;
  conversation_id?: string;
  trace?: TraceStage[];
  message: {
    text: string;
    spoken?: string;
  } | string;
  plan?: Plan | null;
  action?: AssistantAction | null;
  references?: string[];
  tasks?: Task[] | null;
  suggestedFollowUps?: string[];
  error?: ApiError;
}
