import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  style,
  disabled,
  className = '',
  ...rest
}) => {
  const sizeStyles = {
    sm: { padding: '5px 10px', fontSize: '11px', height: '28px', gap: '4px' },
    md: { padding: '6px 14px', fontSize: '13px', height: '36px', gap: '6px' },
    lg: { padding: '10px 18px', fontSize: '14px', height: '44px', gap: '8px' }
  }[size];

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-action-primary)',
      color: 'var(--color-action-on-primary)',
      border: '1px solid var(--color-action-primary)'
    },
    secondary: {
      backgroundColor: 'var(--color-bg-surface)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border-default)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-secondary)',
      border: '1px solid transparent'
    },
    destructive: {
      backgroundColor: 'var(--color-state-failed-bg)',
      color: 'var(--color-state-failed-text)',
      border: '1px solid var(--color-state-failed-border)'
    }
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`daybridge-button ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-pill)',
        fontWeight: 600,
        fontFamily: 'var(--font-ui)',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'transform var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
        outline: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...sizeStyles,
        ...variantStyles,
        ...style
      }}
      onPointerDown={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = 'scale(0.97)';
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
      {icon && iconPosition === 'left' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </button>
  );
};
