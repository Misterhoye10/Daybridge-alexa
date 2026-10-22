import React from 'react';
import type { ActionExecutionState } from '../../types/daybridge';
import { Lightbulb, CircleDashed, LoaderCircle, CircleCheck, CircleX } from 'lucide-react';

interface ActionBadgeProps {
  state: ActionExecutionState | 'running';
  label?: string;
  size?: 'sm' | 'md';
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({
  state,
  label,
  size = 'md'
}) => {
  const config = {
    suggested: {
      defaultLabel: 'Suggested',
      icon: Lightbulb,
      bg: 'var(--color-state-suggested-bg)',
      border: 'var(--color-state-suggested-border)',
      text: 'var(--color-state-suggested-text)'
    },
    awaiting_confirmation: {
      defaultLabel: 'Awaiting confirmation',
      icon: CircleDashed,
      bg: 'var(--color-state-awaiting-bg)',
      border: 'var(--color-state-awaiting-border)',
      text: 'var(--color-state-awaiting-text)'
    },
    running: {
      defaultLabel: 'Running',
      icon: LoaderCircle,
      bg: 'var(--color-state-running-bg)',
      border: 'var(--color-state-running-border)',
      text: 'var(--color-state-running-text)'
    },
    completed: {
      defaultLabel: 'Completed',
      icon: CircleCheck,
      bg: 'var(--color-state-completed-bg)',
      border: 'var(--color-state-completed-border)',
      text: 'var(--color-state-completed-text)'
    },
    failed: {
      defaultLabel: 'Failed',
      icon: CircleX,
      bg: 'var(--color-state-failed-bg)',
      border: 'var(--color-state-failed-border)',
      text: 'var(--color-state-failed-text)'
    }
  }[state as string] || {
    defaultLabel: 'Suggested',
    icon: Lightbulb,
    bg: 'var(--color-state-suggested-bg)',
    border: 'var(--color-state-suggested-border)',
    text: 'var(--color-state-suggested-text)'
  };

  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span
      role={state === 'failed' ? 'alert' : 'status'}
      aria-live="polite"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? '4px' : '6px',
        padding: isSm ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-pill)',
        border: `1px solid ${config.border}`,
        backgroundColor: config.bg,
        color: config.text,
        fontSize: isSm ? 'var(--font-size-caption)' : 'var(--font-size-label)',
        fontWeight: 600,
        fontFamily: 'var(--font-ui)',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
        transition: 'background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)'
      }}
    >
      <Icon
        size={isSm ? 13 : 15}
        strokeWidth={1.75}
        style={{
          animation: state === 'running' ? 'spin 1.8s linear infinite' : 'none'
        }}
      />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
