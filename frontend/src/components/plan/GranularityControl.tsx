import React from 'react';
import { Sliders } from 'lucide-react';

interface GranularityControlProps {
  value: number; // 1 to 5
  onChange: (level: number) => void;
  disabled?: boolean;
  compact?: boolean;
}

export const GranularityControl: React.FC<GranularityControlProps> = ({
  value,
  onChange,
  disabled = false,
  compact = false
}) => {
  const levels = [
    { level: 1, label: 'Macro', hint: 'High-level milestones' },
    { level: 2, label: 'Balanced', hint: 'Recommended daily focus' },
    { level: 3, label: 'Guided', hint: 'Actionable steps' },
    { level: 4, label: 'Detailed', hint: 'Granular sub-sessions' },
    { level: 5, label: 'Micro', hint: 'Step-by-step breakdown' }
  ];

  const currentLevel = levels.find((l) => l.level === value) || levels[1];

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          backgroundColor: 'var(--color-bg-sunken)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-pill)'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Sliders size={11} color="var(--color-action-primary)" />
          Detail:
        </span>
        <div style={{ display: 'inline-flex', gap: '2px', backgroundColor: 'var(--color-bg-surface)', padding: '2px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border-default)' }}>
          {levels.map((item) => {
            const isActive = item.level === value;
            return (
              <button
                key={item.level}
                type="button"
                disabled={disabled}
                onClick={() => onChange(item.level)}
                title={`${item.label}: ${item.hint}`}
                style={{
                  width: '20px',
                  height: '18px',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'var(--color-action-primary)' : 'transparent',
                  color: isActive ? 'var(--color-action-on-primary)' : 'var(--color-text-tertiary)',
                  cursor: disabled ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                {item.level}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-action-primary)', fontWeight: 600 }}>
          {currentLevel.label}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '10px 14px',
        backgroundColor: 'var(--color-bg-sunken)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={13} color="var(--color-action-primary)" />
          <span style={{ fontSize: 'var(--font-size-label)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Plan Detail
          </span>
        </div>
        <span
          style={{
            fontSize: 'var(--font-size-data)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-action-primary)',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            padding: '1px 8px',
            borderRadius: 'var(--radius-pill)'
          }}
        >
          {currentLevel.label} ({value}/5)
        </span>
      </div>

      {/* Segmented Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '4px',
          backgroundColor: 'var(--color-bg-surface)',
          padding: '3px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border-default)'
        }}
      >
        {levels.map((item) => {
          const isActive = item.level === value;
          return (
            <button
              key={item.level}
              type="button"
              disabled={disabled}
              onClick={() => onChange(item.level)}
              title={`${item.label}: ${item.hint}`}
              style={{
                padding: '6px 0',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-data)',
                fontFamily: 'var(--font-mono)',
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? 'var(--color-action-primary)' : 'transparent',
                color: isActive ? 'var(--color-action-on-primary)' : 'var(--color-text-secondary)',
                cursor: disabled ? 'default' : 'pointer',
                transition: 'all var(--duration-fast) var(--ease-standard)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span>{item.level}</span>
            </button>
          );
        })}
      </div>
      <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
        {currentLevel.hint}
      </span>
    </div>
  );
};
