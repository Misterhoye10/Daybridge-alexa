import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
  className?: string;
}

/** Static block + opacity pulse — DESIGN §8 bans shimmer gradients. */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = 'var(--radius-sm)',
  style,
  className = ''
}) => {
  return (
    <div
      className={`daybridge-skeleton ${className}`}
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-bg-sunken)',
        border: '1px solid var(--color-border-default)',
        animation: 'skeletonPulse 1.2s ease-in-out infinite',
        ...style
      }}
    />
  );
};
