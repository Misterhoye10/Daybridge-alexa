import React, { useState, useRef, useEffect } from 'react';
import type { Plan, Task, AssistantAction } from '../../types/daybridge';
import { TaskItem } from './TaskItem';
import { ActionBadge } from '../common/ActionBadge';
import { EmptyState } from '../primitives/EmptyState';
import { PlanSkeleton } from './PlanSkeleton';
import {
  Calendar,
  Check,
  Plus,
  Bookmark,
  CheckCircle2,
  Pencil,
  LayoutGrid,
  List,
  RotateCcw,
  Download,
  Copy,
  Timer
} from 'lucide-react';
import { gsap, useGSAP } from '../../motion/setup';
import { motion, RISE_Y } from '../../motion/tokens';

interface PlanCanvasProps {
  plan: Plan | null;
  pendingAction?: AssistantAction;
  isSaved?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  onSavePlan: () => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onApplyAction?: (action: AssistantAction) => void;
  onDismissAction?: () => void;
  onAddNewTask?: () => void;
  onRebalanceSchedule?: () => void;
  onUpdatePlanTitle?: (newTitle: string) => void;
  onAskForPlan?: () => void;
  onExportIcs?: () => void;
  onCopyMarkdown?: () => void;
}

export const PlanCanvas: React.FC<PlanCanvasProps> = ({
  plan,
  pendingAction,
  isSaved = false,
  isLoading = false,
  isSaving = false,
  onSavePlan,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onApplyAction,
  onDismissAction,
  onAddNewTask,
  onRebalanceSchedule,
  onUpdatePlanTitle,
  onAskForPlan,
  onExportIcs,
  onCopyMarkdown
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'timeline' | 'board'>('timeline');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(plan?.title || '');
  const rootRef = useRef<HTMLDivElement>(null);
  const prevPlanId = useRef<string | null>(plan?.id ?? null);
  const prevActionState = useRef(pendingAction?.state);
  const [flashTaskIds, setFlashTaskIds] = useState<string[]>([]);

  // Plan arrives — fade up 8px together, no stagger (DESIGN §6)
  useGSAP(
    () => {
      if (!plan) return;
      const isArrival = prevPlanId.current !== plan.id;
      prevPlanId.current = plan.id;
      if (!isArrival) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.plan-arrival', {
          y: RISE_Y,
          autoAlpha: 0,
          duration: motion.slow,
          ease: motion.enter
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.plan-arrival', { autoAlpha: 0, duration: motion.fast });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [plan?.id] }
  );

  // Completed confirm — changed rows highlight then fade (duration.fade = 1200ms)
  useEffect(() => {
    const prev = prevActionState.current;
    prevActionState.current = pendingAction?.state;
    if (prev !== 'running' || pendingAction?.state !== 'completed' || !plan) return;
    setFlashTaskIds(plan.tasks.map((t) => t.id));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setFlashTaskIds([]);
      return;
    }
    const frame = requestAnimationFrame(() => {
      gsap.fromTo(
        '.agent-task-card--flash',
        { backgroundColor: 'var(--color-state-completed-bg)' },
        {
          backgroundColor: 'var(--color-bg-surface)',
          duration: motion.fade,
          ease: motion.standard,
          onComplete: () => setFlashTaskIds([])
        }
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingAction?.state, plan]);

  const handleStartEditTitle = () => {
    if (!plan) return;
    setTitleDraft(plan.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (titleDraft.trim() && onUpdatePlanTitle) {
      onUpdatePlanTitle(titleDraft.trim());
    }
    setIsEditingTitle(false);
  };

  // Loading a first plan — skeleton, not empty (#3)
  if (!plan && isLoading) {
    return <PlanSkeleton />;
  }

  // Active-plan empty ≠ saved-library empty (DESIGN microcopy for library stays in drawer)
  if (!plan) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-bg-surface)',
          minHeight: '480px'
        }}
      >
        <EmptyState
          headline="No plan open"
          supportText="Ask on the left for a goal and how much time you have. I'll build the plan here."
          actionLabel={onAskForPlan ? 'Ask for a plan' : undefined}
          onAction={onAskForPlan}
        />
      </div>
    );
  }

  const completedCount = plan.tasks.filter((t) => t.done || t.isCompleted).length;
  const totalCount = plan.tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Day list extraction
  const dayNames = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const isAllDays = selectedDay === 'All';

  const displayedTasks = plan.tasks.filter((task) => {
    if (!isAllDays) {
      const taskDay = task.day || '';
      if (!taskDay.toLowerCase().includes(selectedDay.toLowerCase())) return false;
    }
    return true;
  });

  const totalMinutes = plan.tasks.reduce((acc, t) => acc + (t.minutes || t.estimatedMinutes || 0), 0);

  // Group displayed tasks by day for structured timeline rendering
  const groupedTasks: { [key: string]: Task[] } = {};
  displayedTasks.forEach((task) => {
    const key = task.day || 'General';
    if (!groupedTasks[key]) groupedTasks[key] = [];
    groupedTasks[key].push(task);
  });

  // Categorize for Status Board View (Agent Lifecycle Triage)
  const needsApprovalTasks = displayedTasks.filter(
    (t) => pendingAction?.payload?.taskId === t.id || t.isSuggested || (pendingAction && pendingAction.state === 'awaiting_confirmation')
  );
  const completedTasks = displayedTasks.filter((t) => t.done || t.isCompleted);
  const inProgressTasks = displayedTasks.filter(
    (t) => !completedTasks.includes(t) && !needsApprovalTasks.includes(t)
  );

  return (
    <div
      ref={rootRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-bg-surface)',
        overflow: 'hidden'
      }}
    >
      {/* Calm, Precision Header */}
      <div
        className="panel-pad plan-arrival"
        style={{
          paddingTop: '16px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--color-border-default)',
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        {/* Top bar: Status & Primary Action */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: isSaved ? 'var(--color-state-completed-text)' : 'var(--color-text-tertiary)',
                backgroundColor: isSaved ? 'var(--color-state-completed-bg)' : 'var(--color-bg-sunken)',
                border: `1px solid ${isSaved ? 'var(--color-state-completed-border)' : 'var(--color-border-default)'}`,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {isSaved ? <Check size={11} strokeWidth={2.5} /> : null}
              {isSaved ? 'Saved plan' : 'Draft plan'}
            </span>

            {needsApprovalTasks.length > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-state-awaiting-text)',
                  backgroundColor: 'var(--color-state-awaiting-bg)',
                  border: '1px solid var(--color-state-awaiting-border)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-state-awaiting-text)' }} />
                {needsApprovalTasks.length} Needs approval
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* View Mode Segmented Control: [ Timeline | Board ] */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-bg-sunken)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-pill)',
                padding: '2px',
                gap: '2px'
              }}
            >
              <button
                type="button"
                className={`plan-seg-btn${viewMode === 'timeline' ? ' is-active' : ''}`}
                onClick={() => setViewMode('timeline')}
              >
                <List size={11} />
                Timeline
              </button>
              <button
                type="button"
                className={`plan-seg-btn${viewMode === 'board' ? ' is-active' : ''}`}
                onClick={() => setViewMode('board')}
              >
                <LayoutGrid size={11} />
                Board
              </button>
            </div>

            {onRebalanceSchedule && (
              <button
                type="button"
                className="plan-toolbar-btn plan-toolbar-btn--ghost"
                onClick={onRebalanceSchedule}
                title="Propose a 30-minute rebalance"
                aria-label="Rebalance to 30 minutes"
              >
                <Timer size={12} />
                30m
              </button>
            )}
            {onExportIcs && (
              <button
                type="button"
                className="plan-toolbar-btn plan-toolbar-btn--ghost"
                onClick={onExportIcs}
                title="Download .ics calendar"
                aria-label="Export calendar"
              >
                <Download size={12} />
                .ics
              </button>
            )}
            {onCopyMarkdown && (
              <button
                type="button"
                className="plan-toolbar-btn plan-toolbar-btn--ghost"
                onClick={onCopyMarkdown}
                title="Copy plan as Markdown"
                aria-label="Copy Markdown"
              >
                <Copy size={12} />
              </button>
            )}
            {!isSaved ? (
              <button
                type="button"
                className="plan-toolbar-btn plan-toolbar-btn--primary"
                onClick={onSavePlan}
                disabled={isSaving}
                aria-busy={isSaving}
                title={isSaving ? 'Saving…' : 'Save plan to library'}
              >
                <Bookmark size={12} />
                {isSaving ? 'Saving…' : 'Save plan'}
              </button>
            ) : (
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-tertiary)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Synchronized
              </span>
            )}
          </div>
        </div>

        {/* Plan Title (Inline Editable) & Objective */}
        {isEditingTitle ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') {
                  setTitleDraft(plan.title);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              style={{
                flex: 1,
                fontSize: 'var(--font-size-h2)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-bg-sunken)',
                border: '1px solid var(--color-action-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                outline: 'none',
                fontFamily: 'var(--font-ui)'
              }}
            />
            <button
              onClick={handleSaveTitle}
              style={{
                padding: '5px 12px',
                backgroundColor: 'var(--color-action-primary)',
                color: 'var(--color-action-on-primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setTitleDraft(plan.title);
                setIsEditingTitle(false);
              }}
              style={{
                padding: '5px 8px',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 0 6px 0',
              cursor: 'pointer'
            }}
            onClick={handleStartEditTitle}
            title="Click to edit plan title"
          >
            <h2
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--font-size-h2)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                margin: 0,
                letterSpacing: '-0.01em'
              }}
            >
              {plan.title}
            </h2>
            <Pencil size={13} color="var(--color-text-tertiary)" style={{ opacity: 0.6 }} />
          </div>
        )}
        <p
          style={{
            fontSize: 'var(--font-size-body)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--line-height-body)',
            margin: '0 0 16px 0'
          }}
        >
          {plan.objective || plan.summary}
        </p>

        {/* Minimal Progress Bar (Section 8) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-border-default)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--font-size-data)',
                fontWeight: 500,
                color: 'var(--color-text-secondary)'
              }}
            >
              {completedCount} of {totalCount} completed
            </span>
            <span style={{ color: 'var(--color-border-default)' }}>·</span>
            <span
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--font-size-data)',
                color: 'var(--color-text-tertiary)'
              }}
            >
              {totalMinutes} min total
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Plan completion progress"
            style={{
              width: '96px',
              height: '6px',
              backgroundColor: 'var(--color-bg-sunken)',
              borderRadius: 'var(--radius-pill)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${completionPercentage}%`,
                backgroundColor:
                  completionPercentage === 100
                    ? 'var(--color-state-completed-text)'
                    : 'var(--color-action-primary)',
                borderRadius: 'var(--radius-pill)',
                transition: 'width var(--duration-base) var(--ease-standard)'
              }}
            />
          </div>
        </div>

        {/* Quiet Day Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            marginTop: '14px',
            overflowX: 'auto'
          }}
        >
          {dayNames.map((d) => {
            const isActive = selectedDay === d;
            return (
              <button
                type="button"
                key={d}
                className={`plan-day-chip${isActive ? ' is-active' : ''}`}
                onClick={() => setSelectedDay(d)}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Action Bar (PRD Section 4 & 8) */}
      {pendingAction && (
        <div
          className="panel-pad"
          style={{
            paddingTop: '12px',
            paddingBottom: '12px',
            backgroundColor:
              pendingAction.state === 'awaiting_confirmation'
                ? 'var(--color-state-awaiting-bg)'
                : pendingAction.state === 'failed'
                ? 'var(--color-state-failed-bg)'
                : 'var(--color-state-suggested-bg)',
            borderBottom: `1px solid ${
              pendingAction.state === 'awaiting_confirmation'
                ? 'var(--color-state-awaiting-border)'
                : pendingAction.state === 'failed'
                ? 'var(--color-state-failed-border)'
                : 'var(--color-state-suggested-border)'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ActionBadge state={pendingAction.state} label={pendingAction.label} size="sm" />
            <span
              style={{
                fontSize: 'var(--font-size-body)',
                color:
                  pendingAction.state === 'awaiting_confirmation'
                    ? 'var(--color-state-awaiting-text)'
                    : 'var(--color-state-suggested-text)'
              }}
            >
              {pendingAction.description}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            {onApplyAction &&
              (pendingAction.state === 'awaiting_confirmation' ||
                pendingAction.state === 'suggested') && (
                <button
                  type="button"
                  className="plan-action-btn plan-action-btn--primary"
                  onClick={() => onApplyAction(pendingAction)}
                >
                  <Check size={12} /> Confirm changes
                </button>
              )}
            {onApplyAction && pendingAction.state === 'failed' && (
              <button
                type="button"
                className="plan-action-btn plan-action-btn--secondary"
                onClick={() => onApplyAction(pendingAction)}
              >
                <RotateCcw size={12} /> Retry
              </button>
            )}
            {pendingAction.state === 'running' && (
              <span
                style={{
                  fontSize: 'var(--font-size-label)',
                  color: 'var(--color-text-secondary)',
                  alignSelf: 'center'
                }}
              >
                Applying…
              </span>
            )}
            {onDismissAction && pendingAction.state !== 'running' && (
              <button
                type="button"
                className="plan-action-btn plan-action-btn--ghost"
                onClick={onDismissAction}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Area: Dual-View Mode (Timeline with 3-tier depth vs Status Board Triage) */}
      <div
        className="no-scrollbar panel-pad plan-arrival"
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingTop: '16px',
          paddingBottom: '20px'
        }}
      >
        {viewMode === 'board' ? (
          /* Status Board Kanban View */
          <div
            className="plan-board-grid"
            style={{
              display: 'grid',
              gap: '14px',
              alignItems: 'start',
              paddingBottom: '16px'
            }}
          >
            {/* Column 1: NEEDS APPROVAL */}
            <div className="swimlane-well">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border-default)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-state-awaiting-text)'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    Needs You
                  </span>
                </div>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-secondary)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-pill)'
                  }}
                >
                  {needsApprovalTasks.length}
                </span>
              </div>

              {needsApprovalTasks.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '120px',
                    color: 'var(--color-text-tertiary)',
                    fontSize: '12px'
                  }}
                >
                  Nothing here
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {needsApprovalTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleTask}
                      onUpdateTask={onUpdateTask}
                      onDeleteTask={onDeleteTask}
                      isSuggested={true}
                      isFlashing={flashTaskIds.includes(task.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: IN PROGRESS / RUNNING */}
            <div className="swimlane-well">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border-default)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-action-primary)'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    Running
                  </span>
                </div>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-secondary)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-pill)'
                  }}
                >
                  {inProgressTasks.length}
                </span>
              </div>

              {inProgressTasks.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '120px',
                    color: 'var(--color-text-tertiary)',
                    fontSize: '12px'
                  }}
                >
                  No active tasks
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {inProgressTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleTask}
                      onUpdateTask={onUpdateTask}
                      onDeleteTask={onDeleteTask}
                      isSuggested={false}
                      isFlashing={flashTaskIds.includes(task.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: CONFIRMED / DONE */}
            <div className="swimlane-well">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border-default)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-state-completed-text)'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    Done
                  </span>
                </div>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-default)',
                    color: 'var(--color-text-secondary)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-pill)'
                  }}
                >
                  {completedTasks.length}
                </span>
              </div>

              {completedTasks.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '120px',
                    color: 'var(--color-text-tertiary)',
                    fontSize: '12px'
                  }}
                >
                  Nothing completed yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleTask}
                      onUpdateTask={onUpdateTask}
                      onDeleteTask={onDeleteTask}
                      isSuggested={false}
                      isFlashing={flashTaskIds.includes(task.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Timeline Document View with 3-Tier Sunken Troughs */
          Object.entries(groupedTasks).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-tertiary)' }}>
              <p style={{ fontSize: 'var(--font-size-body)' }}>No items match the selected filter.</p>
            </div>
          ) : (
            Object.entries(groupedTasks).map(([groupName, tasks]) => {
              const groupMinutes = tasks
                .filter((t) => (t.kind || 'task') !== 'marker')
                .reduce((acc, t) => acc + (t.minutes || t.estimatedMinutes || 0), 0);
              const isGroupCompleted = tasks.every((t) => t.done || t.isCompleted);

              return (
                <div key={groupName} className="swimlane-well" style={{ marginBottom: '18px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--color-border-default)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={13} color="var(--color-text-secondary)" />
                      <h4
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          margin: 0
                        }}
                      >
                        {groupName}
                      </h4>
                      {groupMinutes > 0 && (
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-tertiary)',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          · {groupMinutes}m
                        </span>
                      )}
                    </div>

                    {isGroupCompleted && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          color: 'var(--color-state-completed-text)',
                          fontWeight: 500
                        }}
                      >
                        <CheckCircle2 size={12} /> Done
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={onToggleTask}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                        isSuggested={pendingAction?.payload?.taskId === task.id}
                        isFlashing={flashTaskIds.includes(task.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )
        )}

        {onAddNewTask && (
          <button
            type="button"
            className="plan-add-item"
            onClick={onAddNewTask}
            aria-label="Add item to plan"
          >
            <Plus size={14} strokeWidth={2} aria-hidden="true" />
            Add item
          </button>
        )}
      </div>
    </div>
  );
};
