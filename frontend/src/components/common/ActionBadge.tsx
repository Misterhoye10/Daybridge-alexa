import React from 'react';
import type { ActionExecutionState } from '../../types/daybridge';
import { Sparkles, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface ActionBadgeProps {
  state: ActionExecutionState;
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
      defaultLabel: 'Suggested Action',
      icon: Sparkles,
      borderColor: 'var(--state-suggested-border)',
      bgColor: 'var(--state-suggested-bg)',
      textColor: 'var(--state-suggested-text)',
      glow: '0 0 12px rgba(253, 186, 116, 0.25)'
    },
    awaiting_confirmation: {
      defaultLabel: 'Awaiting Confirmation',
      icon: AlertCircle,
      borderColor: 'var(--state-awaiting-border)',
      bgColor: 'var(--state-awaiting-bg)',
      textColor: 'var(--state-awaiting-text)',
      glow: '0 0 14px rgba(216, 180, 254, 0.3)'
    },
    completed: {
      defaultLabel: 'Executed & Saved',
      icon: CheckCircle2,
      borderColor: 'var(--state-completed-border)',
      bgColor: 'var(--state-completed-bg)',
      textColor: 'var(--state-completed-text)',
      glow: '0 0 12px rgba(0, 212, 170, 0.25)'
    },
    failed: {
      defaultLabel: 'Failed',
      icon: XCircle,
      borderColor: 'var(--state-failed-border)',
      bgColor: 'var(--state-failed-bg)',
      textColor: 'var(--state-failed-text)',
      glow: '0 0 12px rgba(244, 63, 94, 0.25)'
    }
  }[state];

  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? '4px' : '6px',
        padding: isSm ? '2px 8px' : '4px 12px',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${config.borderColor}`,
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontSize: isSm ? '0.72rem' : '0.8rem',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        boxShadow: config.glow,
        transition: 'var(--transition-fast)'
      }}
    >
      <Icon size={isSm ? 12 : 14} />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
