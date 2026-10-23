import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
}

/** Sticky connectivity strip — DESIGN offline copy (#3, #18). */
export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="offline-banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: 'var(--color-state-failed-bg)',
        borderBottom: '1px solid var(--color-state-failed-border)',
        color: 'var(--color-state-failed-text)',
        fontSize: 'var(--font-size-body)',
        lineHeight: 1.4,
        textAlign: 'center'
      }}
    >
      <WifiOff size={14} aria-hidden="true" style={{ flexShrink: 0 }} />
      <span>Connection lost. Your conversation is safe. Retry when you're back online.</span>
    </div>
  );
};
