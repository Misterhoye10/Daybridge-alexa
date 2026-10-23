/** One-click judge demos — 60s path with zero typing friction. */
export type JudgeScenarioId =
  | 'create_plan'
  | 'make_easier'
  | 'rebalance'
  | 'failure_drill';

export interface JudgeScenario {
  id: JudgeScenarioId;
  label: string;
  /** Sent as chat, or empty when handled by App (rebalance / fail flag). */
  message?: string;
  /** Arm demo fail-next before send */
  forceFail?: boolean;
  /** Trigger local rebalance propose instead of chat */
  rebalance?: boolean;
  hint: string;
}

export const JUDGE_SCENARIOS: JudgeScenario[] = [
  {
    id: 'create_plan',
    label: '1 · Create plan',
    message:
      'Help me prepare for a software engineering interview on Friday. I have one hour each evening.',
    hint: 'Draft plan, present tense'
  },
  {
    id: 'make_easier',
    label: '2 · Confirm change',
    message: 'Make the first day easier and add a mock interview',
    hint: 'Awaiting → Confirm'
  },
  {
    id: 'rebalance',
    label: '3 · Rebalance 30m',
    rebalance: true,
    hint: 'Chunk + bump, Confirm'
  },
  {
    id: 'failure_drill',
    label: '4 · Fail drill',
    message: 'Make the first day easier and add a mock interview',
    forceFail: true,
    hint: '503 → Retry, no false success'
  }
];
