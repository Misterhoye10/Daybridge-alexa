import React from 'react';
import { Skeleton } from '../primitives/Skeleton';

/** Plan-card skeleton while assistant builds a first plan (DESIGN §8 — no shimmer). */
export const PlanSkeleton: React.FC = () => {
  return (
    <div
      className="plan-skeleton panel-pad"
      role="status"
      aria-busy="true"
      aria-label="Building plan"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingTop: '20px',
        height: '100%'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <Skeleton width="40%" height="14px" />
        <Skeleton width="72px" height="28px" borderRadius="var(--radius-md)" />
      </div>
      <Skeleton width="70%" height="24px" />
      <Skeleton width="100%" height="8px" borderRadius="var(--radius-pill)" />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width="64px" height="28px" borderRadius="var(--radius-pill)" />
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            padding: '12px 14px',
            border: '1px solid var(--color-border-default)',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Skeleton width="20px" height="20px" borderRadius="5px" />
            <Skeleton width="60%" height="16px" />
          </div>
          <Skeleton width="90%" height="12px" />
        </div>
      ))}
    </div>
  );
};
