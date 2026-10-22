import React from 'react';
import { Clock, AlertTriangle, Compass, ArrowRightLeft } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
  plannedMinutes?: number;
  capacityMinutes?: number;
  className?: string;
  onOpenRitual?: () => void;
  onRebalance?: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  completed, 
  total,
  plannedMinutes = 0,
  capacityMinutes = 60,
  className = '',
  onOpenRitual,
  onRebalance
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const capacityPct = capacityMinutes > 0 ? Math.round((plannedMinutes / capacityMinutes) * 100) : 0;
  const isOvercommitted = capacityMinutes > 0 && plannedMinutes > capacityMinutes;
  const overcommitMins = plannedMinutes - capacityMinutes;

  return (
    <div className={`daybridge-progress-wrapper ${className}`} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Task Completion Progress Row */}
      <div>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: 'var(--font-size-caption)',
            color: 'var(--color-text-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Sprint Progress</span>
            <span className="tabular-nums" style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              {completed} of {total} completed
            </span>
          </div>
          <span 
            className="tabular-nums"
            style={{ 
              fontFamily: 'var(--font-mono)', 
              fontWeight: 600, 
              color: percentage === 100 ? 'var(--color-state-completed-text)' : 'var(--color-action-primary)' 
            }}
          >
            {percentage}%
          </span>
        </div>

        <div
          style={{
            height: '7px',
            backgroundColor: 'var(--color-bg-sunken)',
            borderRadius: 'var(--radius-pill)',
            overflow: 'hidden',
            border: '1px solid var(--color-border-default)'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, percentage)}%`,
              backgroundColor: percentage === 100 ? 'var(--color-state-completed-text)' : 'var(--color-action-primary)',
              borderRadius: 'var(--radius-pill)',
              transition: 'width var(--duration-base) var(--ease-standard)'
            }}
          />
        </div>
      </div>

      {/* Sunsama Workload Capacity Meter */}
      {capacityMinutes > 0 && (
        <div
          style={{
            marginTop: '2px',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isOvercommitted ? 'var(--color-state-awaiting-bg)' : 'var(--color-bg-sunken)',
            border: `1px solid ${isOvercommitted ? 'var(--color-state-awaiting-border)' : 'var(--color-border-default)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} color={isOvercommitted ? 'var(--color-state-awaiting-text)' : 'var(--color-action-primary)'} />
              <span
                style={{
                  fontSize: 'var(--font-size-caption)',
                  fontWeight: 600,
                  color: isOvercommitted ? 'var(--color-state-awaiting-text)' : 'var(--color-text-secondary)'
                }}
              >
                Workload Capacity:
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isOvercommitted ? 'var(--color-state-awaiting-text)' : 'var(--color-text-primary)'
                }}
              >
                {plannedMinutes}m / {capacityMinutes}m target ({capacityPct}%)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {onRebalance && (
                <button
                  onClick={onRebalance}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border-default)',
                    backgroundColor: 'var(--color-bg-surface)',
                    color: 'var(--color-action-primary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Auto-cascade tasks to fit daily capacity"
                >
                  <ArrowRightLeft size={11} />
                  <span>Auto-Cascade</span>
                </button>
              )}

              {onOpenRitual && (
                <button
                  onClick={onOpenRitual}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border-default)',
                    backgroundColor: 'var(--color-bg-surface)',
                    color: 'var(--color-action-primary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Open guided daily planning ritual"
                >
                  <Compass size={11} />
                  <span>Daily Ritual</span>
                </button>
              )}
            </div>
          </div>

          {/* Thin Capacity Indicator Bar */}
          <div
            style={{
              height: '4px',
              backgroundColor: 'var(--color-border-default)',
              borderRadius: 'var(--radius-pill)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, capacityPct)}%`,
                backgroundColor: isOvercommitted ? 'var(--color-accent-highlight)' : 'var(--color-action-primary)',
                borderRadius: 'var(--radius-pill)',
                transition: 'width var(--duration-base) var(--ease-standard)'
              }}
            />
          </div>

          {/* Overcommitment Alert Callout */}
          {isOvercommitted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-state-awaiting-text)' }}>
              <AlertTriangle size={11} />
              <span>Overcommitted by {overcommitMins}m. Consider deferring a task to protect focus.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
