import React from 'react';
import type { ActionExecutionState } from '../../types/daybridge';
import { ActionBadge } from '../common/ActionBadge';
import { Button } from './Button';
import { Check, X, RotateCcw } from 'lucide-react';

export type ActionCardState = ActionExecutionState | 'running' | 'dismissed';

export interface ActionCardProps {
  state: ActionCardState;
  title: string;
  description: string;
  onApply?: () => void;
  onDismiss?: () => void;
  onRetry?: () => void;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  state,
  title,
  description,
  onApply,
  onDismiss,
  onRetry,
  error,
  className = '',
  style
}) => {
  const stateThemes: Record<ActionCardState, { bg: string; border: string; text: string }> = {
    suggested: {
      bg: 'var(--color-state-suggested-bg)',
      border: 'var(--color-state-suggested-border)',
      text: 'var(--color-state-suggested-text)'
    },
    awaiting_confirmation: {
      bg: 'var(--color-state-awaiting-bg)',
      border: 'var(--color-state-awaiting-border)',
      text: 'var(--color-state-awaiting-text)'
    },
    running: {
      bg: 'var(--color-state-running-bg)',
      border: 'var(--color-state-running-border)',
      text: 'var(--color-state-running-text)'
    },
    completed: {
      bg: 'var(--color-state-completed-bg)',
      border: 'var(--color-state-completed-border)',
      text: 'var(--color-state-completed-text)'
    },
    failed: {
      bg: 'var(--color-state-failed-bg)',
      border: 'var(--color-state-failed-border)',
      text: 'var(--color-state-failed-text)'
    },
    dismissed: {
      bg: 'var(--color-bg-sunken)',
      border: 'var(--color-border-default)',
      text: 'var(--color-text-tertiary)'
    }
  };

  const theme = stateThemes[state] || stateThemes.suggested;

  return (
    <div
      className={`daybridge-action-card ${className}`}
      style={{
        padding: '14px 16px',
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: 'var(--elevation-e1)',
        transition: 'all var(--duration-fast) var(--ease-standard)',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ActionBadge state={state as ActionExecutionState} label={title} size="sm" />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {state === 'suggested' && onApply && (
            <Button size="sm" variant="primary" icon={<Check size={12} />} onClick={onApply}>
              Apply
            </Button>
          )}

          {state === 'awaiting_confirmation' && onApply && (
            <Button size="sm" variant="primary" icon={<Check size={12} />} onClick={onApply}>
              Confirm Action
            </Button>
          )}

          {state === 'failed' && onRetry && (
            <Button size="sm" variant="secondary" icon={<RotateCcw size={12} />} onClick={onRetry}>
              Retry
            </Button>
          )}

          {(state === 'suggested' || state === 'awaiting_confirmation') && onDismiss && (
            <Button size="sm" variant="ghost" icon={<X size={12} />} onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 'var(--font-size-body)',
          color: theme.text,
          lineHeight: 'var(--line-height-body)'
        }}
      >
        {description}
      </p>

      {error && (
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-state-failed-text)'
          }}
        >
          Reason: {error}
        </span>
      )}
    </div>
  );
};
