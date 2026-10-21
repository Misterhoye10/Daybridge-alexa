import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  completed, 
  total,
  className = '' 
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`daybridge-progress-wrapper ${className}`} style={{ width: '100%' }}>
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Progress</span>
          <span style={{ color: 'var(--text-muted)' }}>({completed}/{total} tasks done)</span>
        </div>
        <span 
          style={{ 
            fontFamily: 'var(--font-mono)', 
            fontWeight: 600, 
            color: percentage === 100 ? 'var(--brand-teal)' : 'var(--brand-cyan)' 
          }}
        >
          {percentage}%
        </span>
      </div>

      <div
        style={{
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: 'var(--brand-gradient)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: percentage > 0 ? '0 0 12px rgba(0, 212, 170, 0.5)' : 'none'
          }}
        />
      </div>
    </div>
  );
};
