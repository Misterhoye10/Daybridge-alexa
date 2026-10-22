import React from 'react';
import { ArrowRight, Plus, Minus } from 'lucide-react';

export interface DiffRowProps {
  field: string;
  before?: string | number;
  after: string | number;
  changeType?: 'added' | 'modified' | 'removed';
}

export const DiffRow: React.FC<DiffRowProps> = ({
  field,
  before,
  after,
  changeType = 'modified'
}) => {
  const typeStyles = {
    added: {
      color: 'var(--color-state-completed-text)',
      bg: 'var(--color-state-completed-bg)',
      icon: <Plus size={11} />
    },
    modified: {
      color: 'var(--color-action-primary)',
      bg: 'var(--color-state-suggested-bg)',
      icon: <ArrowRight size={11} />
    },
    removed: {
      color: 'var(--color-state-failed-text)',
      bg: 'var(--color-state-failed-bg)',
      icon: <Minus size={11} />
    }
  }[changeType];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 10px',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border-default)',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: typeStyles.bg,
            color: typeStyles.color
          }}
        >
          {typeStyles.icon}
        </span>
        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-ui)' }}>
          {field}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {before !== undefined && changeType === 'modified' && (
          <span style={{ textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>
            {before}
          </span>
        )}
        <span style={{ fontWeight: 600, color: typeStyles.color }}>
          {after}
        </span>
      </div>
    </div>
  );
};
