import React, { useState, useEffect, useRef } from 'react';
import type { Plan } from '../../types/daybridge';
import { ProgressBar } from '../plan/ProgressBar';
import { Skeleton } from '../primitives/Skeleton';
import { X, Trash2, Calendar, FolderOpen, ArrowRight, AlertCircle, RotateCcw } from 'lucide-react';
import { gsap, useGSAP } from '../../motion/setup';
import { motion } from '../../motion/tokens';

interface SavedPlansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: Plan[];
  activePlanId?: string;
  onSelectPlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const SavedPlansDrawer: React.FC<SavedPlansDrawerProps> = ({
  isOpen,
  onClose,
  savedPlans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  isLoading = false,
  error = null,
  onRetry
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

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

  // Drawer open — DESIGN §6: panels/drawers use slow + ease.enter
  useGSAP(
    () => {
      if (!isOpen) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.saved-plans-scrim',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: motion.base, ease: motion.standard }
        );
        gsap.fromTo(
          '.saved-plans-sheet',
          { x: 28, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: motion.slow, ease: motion.enter }
        );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.fromTo(
          '.saved-plans-scrim, .saved-plans-sheet',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: motion.fast }
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [isOpen] }
  );

  if (!isOpen) return null;

  return (
    <div
      ref={rootRef}
      className="saved-plans-scrim"
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
        justifyContent: 'flex-end'
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Saved Plans"
        className="saved-plans-sheet"
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
          {error && (
            <div
              role="alert"
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-state-failed-bg)',
                border: '1px solid var(--color-state-failed-border)',
                color: 'var(--color-state-failed-text)',
                fontSize: 'var(--font-size-body)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '4px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ flex: 1 }}>{error}</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid var(--color-state-failed-border)',
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-state-failed-text)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 10px',
                    fontWeight: 600,
                    fontSize: 'var(--font-size-label)',
                    cursor: 'pointer',
                    minHeight: '44px'
                  }}
                >
                  <RotateCcw size={12} /> Retry
                </button>
              )}
            </div>
          )}

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} role="status" aria-busy="true" aria-label="Loading saved plans">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    padding: '16px',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <Skeleton width="70%" height="18px" />
                  <Skeleton width="100%" height="12px" />
                  <Skeleton width="100%" height="8px" borderRadius="var(--radius-pill)" />
                </div>
              ))}
            </div>
          ) : savedPlans.length === 0 && !error ? (
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
          ) : savedPlans.length === 0 ? null : (
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
