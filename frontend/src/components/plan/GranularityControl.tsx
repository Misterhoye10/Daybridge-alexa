import React from 'react';
import { Sliders, Sparkles } from 'lucide-react';

interface GranularityControlProps {
  value: number; // 1 to 5
  onChange: (level: number) => void;
  disabled?: boolean;
}

export const GranularityControl: React.FC<GranularityControlProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const levels = [
    { level: 1, label: 'Macro', hint: 'High-level milestones' },
    { level: 2, label: 'Balanced', hint: 'Recommended daily focus' },
    { level: 3, label: 'Guided', hint: 'Actionable steps' },
    { level: 4, label: 'Detailed', hint: 'Granular sub-sessions' },
    { level: 5, label: 'Micro', hint: 'Step-by-step breakdown' }
  ];

  const currentLevel = levels.find((l) => l.level === value) || levels[1];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '10px 14px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={13} color="var(--brand-teal)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Plan Granularity
          </span>
        </div>
        <span
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--brand-teal)',
            backgroundColor: 'rgba(0, 212, 170, 0.1)',
            padding: '1px 6px',
            borderRadius: 'var(--radius-full)'
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
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          padding: '3px',
          borderRadius: 'var(--radius-sm)'
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
                padding: '4px 0',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--brand-gradient)' : 'transparent',
                color: isActive ? '#0B0F1A' : 'var(--text-muted)',
                cursor: disabled ? 'default' : 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px'
              }}
            >
              {isActive && <Sparkles size={10} />}
              <span>{item.level}</span>
            </button>
          );
        })}
      </div>
      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        {currentLevel.hint}
      </span>
    </div>
  );
};
