import React from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  isActive?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  count,
  icon,
  isActive = false,
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  style,
  ...rest
}) => {
  const sizeStyles = {
    sm: { padding: '3px 8px', fontSize: '11px', height: '24px', gap: '4px' },
    md: { padding: '4px 12px', fontSize: '12px', height: '28px', gap: '6px' }
  }[size];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`daybridge-chip ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'var(--radius-pill)',
        border: `1px solid ${isActive ? 'var(--color-action-primary)' : 'var(--color-border-default)'}`,
        backgroundColor: isActive ? 'var(--color-action-primary)' : 'var(--color-bg-surface)',
        color: isActive ? 'var(--color-action-on-primary)' : 'var(--color-text-secondary)',
        fontWeight: 600,
        fontFamily: 'var(--font-ui)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        outline: 'none',
        transition: 'all var(--duration-fast) var(--ease-standard)',
        ...sizeStyles,
        ...style
      }}
      onPointerDown={(e) => {
        if (!disabled && onClick) {
          e.currentTarget.style.transform = 'scale(0.96)';
        }
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...rest}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            padding: '0 5px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-bg-sunken)',
            color: isActive ? 'var(--color-action-on-primary)' : 'var(--color-text-tertiary)'
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};
