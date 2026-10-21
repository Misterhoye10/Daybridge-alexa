import React from 'react';
import type { Plan, Task, AssistantAction } from '../../types/daybridge';
import { TaskItem } from './TaskItem';
import { ProgressBar } from './ProgressBar';
import { ActionBadge } from '../common/ActionBadge';
import { Bookmark, Check, CheckCircle2, Plus, Calendar, Layers } from 'lucide-react';

interface PlanCanvasProps {
  plan: Plan | null;
  pendingAction?: AssistantAction;
  isSaved?: boolean;
  onSavePlan: () => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onApplyAction?: (action: AssistantAction) => void;
  onDismissAction?: () => void;
  onAddNewTask?: () => void;
}

export const PlanCanvas: React.FC<PlanCanvasProps> = ({
  plan,
  pendingAction,
  isSaved = false,
  onSavePlan,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onApplyAction,
  onDismissAction,
  onAddNewTask
}) => {
  if (!plan) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px dashed var(--border-medium)',
          minHeight: '480px'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--brand-gradient-subtle)',
            border: '1px solid var(--border-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            boxShadow: 'var(--alexa-glow)'
          }}
        >
          <Layers size={28} color="var(--brand-cyan)" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
          Interactive Plan Canvas
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.5 }}>
          Speak or type your goal to the Daybridge assistant on the left. Your dynamic, actionable plan will appear here.
        </p>
      </div>
    );
  }

  const completedCount = plan.tasks.filter((t) => t.isCompleted).length;
  const totalCount = plan.tasks.length;

  // Group tasks by day if available, otherwise "General Tasks"
  const groupedTasks: { [key: string]: Task[] } = {};
  plan.tasks.forEach((task) => {
    const key = task.day || 'General';
    if (!groupedTasks[key]) groupedTasks[key] = [];
    groupedTasks[key].push(task);
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow)'
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          padding: '24px 28px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(255, 255, 255, 0.015)'
        }}
      >
        {/* Top actions & badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--brand-teal)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 600
              }}
            >
              Active Plan
            </span>
            {isSaved && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  color: 'var(--brand-teal)',
                  backgroundColor: 'rgba(0, 212, 170, 0.1)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <Check size={11} /> Saved
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onSavePlan}
              disabled={isSaved}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSaved ? 'rgba(255, 255, 255, 0.05)' : 'var(--brand-gradient)',
                color: isSaved ? 'var(--text-muted)' : '#0B0F1A',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: isSaved ? 'default' : 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <Bookmark size={14} />
              {isSaved ? 'Saved to Library' : 'Save Plan'}
            </button>
          </div>
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          {plan.title}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
          {plan.summary}
        </p>

        {/* Progress Bar */}
        <ProgressBar completed={completedCount} total={totalCount} />
      </div>

      {/* Suggested Action Bar (PRD Requirement 5.4 & 5.5) */}
      {pendingAction && (
        <div
          style={{
            padding: '12px 28px',
            backgroundColor: 'rgba(253, 186, 116, 0.08)',
            borderBottom: '1px solid rgba(253, 186, 116, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ActionBadge state={pendingAction.state} label={pendingAction.label} size="sm" />
            <span style={{ fontSize: '0.82rem', color: '#FED7AA' }}>
              {pendingAction.description}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            {onApplyAction && (
              <button
                onClick={() => onApplyAction(pendingAction)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 12px',
                  backgroundColor: '#FDBA74',
                  color: '#1C1204',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <CheckCircle2 size={12} /> Apply Changes
              </button>
            )}
            {onDismissAction && (
              <button
                onClick={onDismissAction}
                style={{
                  padding: '5px 10px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* Task List / Timeline Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px'
        }}
      >
        {Object.entries(groupedTasks).map(([groupName, tasks]) => (
          <div key={groupName} style={{ marginBottom: '24px' }}>
            {groupName !== 'General' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}
              >
                <Calendar size={14} color="var(--brand-teal)" />
                <h4
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--brand-teal)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {groupName}
                </h4>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
              </div>
            )}

            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                isSuggested={pendingAction?.payload?.taskId === task.id}
              />
            ))}
          </div>
        ))}

        {onAddNewTask && (
          <button
            onClick={onAddNewTask}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-medium)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              marginTop: '8px'
            }}
          >
            <Plus size={14} /> Add new task
          </button>
        )}
      </div>
    </div>
  );
};
