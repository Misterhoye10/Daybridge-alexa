import React from 'react';

export interface PromptChipProps {
  prompt: string;
  onClick: (prompt: string) => void;
  disabled?: boolean;
}

export const PromptChip: React.FC<PromptChipProps> = ({ prompt, onClick, disabled = false }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(prompt)}
      className="daybridge-prompt-chip"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 14px',
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-pill)',
        color: 'var(--color-text-secondary)',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'var(--font-ui)',
        cursor: disabled ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        outline: 'none',
        transition: 'transform var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)',
        flexShrink: 0
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = 'var(--color-action-primary)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-default)';
        e.currentTarget.style.color = 'var(--color-text-secondary)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onPointerDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(0.97)';
        }
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {prompt}
    </button>
  );
};
