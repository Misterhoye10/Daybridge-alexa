import React from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

/** DESIGN: Heard → Understood → Planning → Ready */
export type PipelineStage =
  | 'idle'
  | 'heard'
  | 'understood'
  | 'planning'
  | 'ready'
  | 'failed'
  /** @deprecated alias — map to planning */
  | 'acting'
  /** @deprecated alias — map to ready */
  | 'done';

interface PipelineTraceProps {
  stage: PipelineStage;
  toolName?: string;
  isCollapsed?: boolean;
}

const STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'heard', label: 'Heard' },
  { id: 'understood', label: 'Understood' },
  { id: 'planning', label: 'Planning' },
  { id: 'ready', label: 'Ready' }
];

function normalize(stage: PipelineStage): PipelineStage {
  if (stage === 'acting') return 'planning';
  if (stage === 'done') return 'ready';
  return stage;
}

export const PipelineTrace: React.FC<PipelineTraceProps> = ({
  stage: rawStage,
  toolName,
  isCollapsed = false
}) => {
  const stage = normalize(rawStage);
  if (stage === 'idle') return null;

  const currentStageIndex = STAGES.findIndex((s) => s.id === stage);
  const isFailed = stage === 'failed';

  if (isCollapsed && stage === 'ready') {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontSize: 'var(--font-size-caption)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-tertiary)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: 'var(--color-bg-sunken)'
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--color-state-completed-text)'
          }}
        />
        <span>Ready {toolName ? `[${toolName}]` : ''}</span>
      </div>
    );
  }

  return (
    <nav
      aria-label="Execution pipeline"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: '6px 12px',
        backgroundColor: 'var(--color-bg-sunken)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-pill)',
        fontSize: 'var(--font-size-caption)',
        color: 'var(--color-text-secondary)',
        width: 'fit-content',
        transition: 'all var(--duration-base) var(--ease-standard)'
      }}
    >
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          margin: 0,
          padding: 0,
          listStyle: 'none'
        }}
      >
        {STAGES.map((s, idx) => {
          const failIndex = isFailed ? STAGES.length - 1 : currentStageIndex;
          const isPassed = !isFailed && currentStageIndex > idx;
          const isCurrent = !isFailed && currentStageIndex === idx;
          const showFail = isFailed && idx === failIndex;

          return (
            <React.Fragment key={s.id}>
              {idx > 0 && (
                <span aria-hidden="true" style={{ color: 'var(--color-border-default)', fontSize: '10px' }}>
                  →
                </span>
              )}
              <li
                aria-current={isCurrent ? 'step' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: isCurrent || showFail ? 600 : 400,
                  color: isPassed
                    ? 'var(--color-state-completed-text)'
                    : isCurrent
                    ? 'var(--color-action-primary)'
                    : showFail
                    ? 'var(--color-state-failed-text)'
                    : 'var(--color-text-tertiary)'
                }}
              >
                {isPassed && <Check size={12} strokeWidth={2.5} />}
                {isCurrent && <Loader2 size={12} className="spin" />}
                {showFail && <AlertCircle size={12} />}
                <span>{s.label}</span>
              </li>
            </React.Fragment>
          );
        })}
      </ol>

      {toolName && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-data)',
            padding: '1px 6px',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-primary)'
          }}
        >
          {toolName}
        </span>
      )}
    </nav>
  );
};
