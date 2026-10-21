import React, { useState } from 'react';
import type { Plan } from '../../types/daybridge';
import { ProgressBar } from '../plan/ProgressBar';
import { X, Trash2, Calendar, FolderOpen, ArrowRight, AlertTriangle } from 'lucide-react';

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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'opacity var(--transition-normal)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '22px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderOpen size={20} color="var(--brand-cyan)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>
              Saved Plans
            </h3>
            <span
              style={{
                fontSize: '0.72rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
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
              color: 'var(--text-muted)',
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
                color: 'var(--text-muted)'
              }}
            >
              <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>No saved plans yet.</p>
              <p style={{ fontSize: '0.78rem' }}>Plans you save from the canvas will appear here for easy access.</p>
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
                    backgroundColor: isActive ? 'rgba(14, 165, 233, 0.08)' : 'var(--bg-card)',
                    border: `1px solid ${isActive ? 'var(--brand-cyan)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: isActive ? 'var(--brand-teal)' : '#FFF',
                        lineHeight: 1.3
                      }}
                    >
                      {plan.title}
                    </h4>

                    {/* Delete button or confirmation */}
                    {!isConfirming ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(plan.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Delete plan"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.68rem', color: '#F43F5E', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <AlertTriangle size={11} /> Confirm?
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePlan(plan.id);
                            setConfirmDeleteId(null);
                          }}
                          style={{
                            padding: '2px 6px',
                            backgroundColor: '#F43F5E',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            cursor: 'pointer'
                          }}
                        >
                          Yes
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          style={{
                            padding: '2px 6px',
                            backgroundColor: 'transparent',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            cursor: 'pointer'
                          }}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
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
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <Calendar size={11} /> {new Date(plan.createdAt).toLocaleDateString()}
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
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isActive ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? 'var(--brand-teal)' : '#FFF',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {isActive ? 'Current' : 'Load Plan'} <ArrowRight size={12} />
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
