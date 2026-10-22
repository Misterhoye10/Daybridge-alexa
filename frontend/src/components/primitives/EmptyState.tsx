import React from 'react';
import { Logo } from '../brand/Logo';
import { Button } from './Button';

export interface EmptyStateProps {
  headline: string;
  supportText: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  headline,
  supportText,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        maxWidth: '420px',
        margin: 'auto'
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        {icon ? icon : <Logo size="lg" showWordmark={false} />}
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-size-h1)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: '0 0 8px 0',
          letterSpacing: '-0.01em'
        }}
      >
        {headline}
      </h3>

      <p
        style={{
          fontSize: 'var(--font-size-body)',
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--line-height-body)',
          margin: '0 0 20px 0'
        }}
      >
        {supportText}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
