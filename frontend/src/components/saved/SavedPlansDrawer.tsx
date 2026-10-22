import React, { useState, useEffect } from 'react';
import type { Plan } from '../../types/daybridge';
import { ProgressBar } from '../plan/ProgressBar';
import { X, Trash2, Calendar, FolderOpen, ArrowRight } from 'lucide-react';

interface SavedPlansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: Plan[];
  activePlanId?: string;
  onSelectPlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
}

export const SavedPlansDrawer: React.FC<SavedPlansDrawerProps> = ({
  isOpen,
  onClose,
  savedPlans,
  activePlanId,
  onSelectPlan,
  onDeletePlan
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(14, 21, 20, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'opacity var(--duration-base) var(--ease-standard)'
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Saved Plans"
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--color-bg-surface)',
          borderLeft: '1px solid var(--color-border-default)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--elevation-e3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderOpen size={20} color="var(--color-action-primary)" />
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-h2)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                margin: 0
              }}
            >
              Saved Plans
            </h3>
            <span
              style={{
                fontSize: 'var(--font-size-data)',
                backgroundColor: 'var(--color-bg-sunken)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-default)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {savedPlans.length}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {savedPlans.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--color-text-tertiary)'
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--font-size-h3)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '6px'
                }}
              >
                No saved plans yet.
              </p>
              <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)' }}>
                Ask for one, then save it here.
              </p>
            </div>
          ) : (
            savedPlans.map((plan) => {
              const isActive = plan.id === activePlanId;
              const completedCount = plan.tasks.filter((t) => t.isCompleted).length;
              const isConfirming = confirmDeleteId === plan.id;

              return (
                <div
                  key={plan.id}
                  style={{
                    backgroundColor: isActive ? 'var(--color-bg-sunken)' : 'var(--color-bg-surface)',
                    border: `1px solid ${isActive ? 'var(--color-action-primary)' : 'var(--color-border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    transition: 'all var(--duration-fast) var(--ease-standard)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4
                      style={{
                        fontSize: 'var(--font-size-h3)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.3,
                        margin: 0
                      }}
                    >
                      {plan.title}
                    </h4>

                    {/* Delete button or confirmation dialog */}
                    {!isConfirming ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(plan.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-text-tertiary)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Delete plan"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePlan(plan.id);
                            setConfirmDeleteId(null);
                          }}
                          style={{
                            padding: '3px 8px',
                            backgroundColor: 'var(--color-state-failed-bg)',
                            color: 'var(--color-state-failed-text)',
                            border: '1px solid var(--color-state-failed-border)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Delete plan
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          style={{
                            padding: '3px 8px',
                            backgroundColor: 'transparent',
                            color: 'var(--color-text-secondary)',
                            border: '1px solid var(--color-border-default)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-caption)',
                            cursor: 'pointer'
                          }}
                        >
                          Keep plan
                        </button>
                      </div>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: 'var(--font-size-body)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      margin: '0 0 12px 0'
                    }}
                  >
                    {plan.summary}
                  </p>

                  <ProgressBar completed={completedCount} total={plan.tasks.length} />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '12px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--color-border-default)'
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: 'var(--font-size-data)',
                        color: 'var(--color-text-tertiary)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <Calendar size={11} /> {new Date(plan.created_at || plan.createdAt || 0).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => {
                        onSelectPlan(plan);
                        onClose();
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isActive ? 'var(--color-bg-sunken)' : 'var(--color-action-primary)',
                        color: isActive ? 'var(--color-action-primary)' : 'var(--color-action-on-primary)',
                        border: '1px solid var(--color-border-default)',
                        fontSize: 'var(--font-size-label)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {isActive ? 'Current' : 'Open'} <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
