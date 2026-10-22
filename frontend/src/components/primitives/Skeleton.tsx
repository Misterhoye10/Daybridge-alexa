import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
  className?: string;
}

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
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-bg-sunken)',
        border: '1px solid var(--color-border-default)',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
          animation: 'shimmer 1.5s infinite'
        }}
      />
    </div>
  );
};
