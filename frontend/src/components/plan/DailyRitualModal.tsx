import React, { useState } from 'react';
import type { Plan, Task } from '../../types/daybridge';
import { Compass, CheckCircle2, Clock, AlertTriangle, ArrowRight, X, Shield } from 'lucide-react';

interface DailyRitualModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onUpdateTask: (task: Task) => void;
}

export const DailyRitualModal: React.FC<DailyRitualModalProps> = ({
  isOpen,
  onClose,
  plan,
  onUpdateTask
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const dailyCapacity = plan.dailyCapacityMinutes || 60;

  if (!isOpen) return null;

  // Active day's tasks (defaults to first day or all active)
  const activeTasks = plan.tasks.filter((t) => (t.kind || 'task') !== 'marker');
  const totalPlannedMinutes = activeTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);
  const isOvercommitted = totalPlannedMinutes > dailyCapacity;
  const overcommitMins = totalPlannedMinutes - dailyCapacity;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 21, 20, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-default)',
          boxShadow: 'var(--elevation-e3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
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
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-sunken)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-action-primary)'
              }}
            >
              <Compass size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  margin: 0
                }}
              >
                Guided Planning Ritual
              </h3>
              <span
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Step {step} of 3 • {step === 1 ? 'Review Backlog' : step === 2 ? 'Capacity Check' : 'Lock Intention'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: 'var(--font-size-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  Review Tasks & Carry-Over
                </h4>
                <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Decide what is truly essential for today. Mark finished items or defer low-priority tasks.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: task.isCompleted ? 'var(--color-bg-sunken)' : 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <span style={{ fontSize: 'var(--font-size-body)', fontWeight: 500, color: task.isCompleted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}>
                        {task.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                        {task.estimatedMinutes}m
                      </span>
                      {task.isCompleted ? (
                        <span style={{ fontSize: '11px', color: 'var(--color-state-completed-text)', fontWeight: 600 }}>
                          Done
                        </span>
                      ) : (
                        <button
                          onClick={() => onUpdateTask({ ...task, day: 'Deferred / Later' })}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-bg-sunken)',
                            border: '1px solid var(--color-border-default)',
                            color: 'var(--color-text-secondary)',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          Defer (D)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h4 style={{ fontSize: 'var(--font-size-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  Confront the Time Budget
                </h4>
                <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  A realistic plan beats an overambitious plan. Check your planned duration against your target limit.
                </p>
              </div>

              {/* Capacity Card */}
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isOvercommitted ? 'var(--color-state-awaiting-bg)' : 'var(--color-bg-sunken)',
                  border: `1px solid ${isOvercommitted ? 'var(--color-state-awaiting-border)' : 'var(--color-border-default)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color={isOvercommitted ? 'var(--color-state-awaiting-text)' : 'var(--color-action-primary)'} />
                    <span style={{ fontWeight: 600, color: isOvercommitted ? 'var(--color-state-awaiting-text)' : 'var(--color-text-primary)' }}>
                      Sprint Workload Math
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--font-size-h3)' }}>
                    {totalPlannedMinutes}m planned / {dailyCapacity}m budget
                  </span>
                </div>

                {isOvercommitted ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-body)', color: 'var(--color-state-awaiting-text)' }}>
                    <AlertTriangle size={16} />
                    <span>Overcommitted by {overcommitMins} minutes. Consider deferring 1 task to avoid rushing.</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-body)', color: 'var(--color-state-completed-text)' }}>
                    <CheckCircle2 size={16} />
                    <span>Healthy focus budget! Your planned tasks fit cleanly within your capacity.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '12px 0' }}>
              <div style={{ margin: '0 auto', width: '48px', height: '48px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-state-completed-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-state-completed-text)' }}>
                <Shield size={24} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-h2)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  Ready for Honest Action
                </h4>
                <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto', lineHeight: 'var(--line-height-body)' }}>
                  Your intention is set. Work through your tasks one next step at a time, and report progress as you go.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border-default)',
            backgroundColor: 'var(--color-bg-sunken)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as 1 | 2)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border-default)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-label)',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((step + 1) as 2 | 3)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-action-primary)',
                color: 'var(--color-action-on-primary)',
                border: 'none',
                fontWeight: 600,
                fontSize: 'var(--font-size-label)',
                cursor: 'pointer'
              }}
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-action-primary)',
                color: 'var(--color-action-on-primary)',
                border: 'none',
                fontWeight: 600,
                fontSize: 'var(--font-size-label)',
                cursor: 'pointer'
              }}
            >
              <span>Start Focused Day</span>
              <CheckCircle2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
