import React, { useState, useEffect, useRef } from 'react';
import type { Plan, Task, ChatMessage, AssistantAction } from './types/daybridge';
import { Logo } from './components/brand/Logo';
import { ChatPanel } from './components/chat/ChatPanel';
import { PlanCanvas } from './components/plan/PlanCanvas';
import { SavedPlansDrawer } from './components/saved/SavedPlansDrawer';
import { TokenSwatchPage } from './components/design-system/TokenSwatchPage';
import { apiService, INITIAL_INTERVIEW_PREP_PLAN } from './services/api';
import { useTheme } from './context/ThemeContext';
import { Bookmark, RotateCcw, LayoutList, Sun, Moon, Plus, X } from 'lucide-react';
import { gsap, useGSAP } from './motion/setup';
import { motion } from './motion/tokens';
import { OfflineBanner } from './components/common/OfflineBanner';
import { Toast } from './components/common/Toast';
import { DaybridgeApiError } from './services/api';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activePlan, setActivePlan] = useState<Plan | null>(INITIAL_INTERVIEW_PREP_PLAN);
  const [savedPlans, setSavedPlans] = useState<Plan[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.pathname.startsWith('/design') ||
        window.location.search.includes('view=tokens') ||
        window.location.search.includes('design')
      );
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorRetryable, setErrorRetryable] = useState(true);
  const [lastFailedSend, setLastFailedSend] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(
    () => (typeof navigator !== 'undefined' ? !navigator.onLine : false)
  );
  const [pendingAction, setPendingAction] = useState<AssistantAction | undefined>(undefined);
  /** Mobile only: plan as full-height sheet. Desktop keeps pinned pane. */
  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    'Help me prepare for a software engineering interview on Friday. I have one hour each evening.',
    'Start planning ritual',
    'Review workload capacity',
    'Make the first day easier and add a mock interview',
    'Start daily shutdown'
  ]);

  // Load saved plans on mount. Soft-fail: empty library, no banner on first paint.
  // Connection errors belong to chat/save/confirm — not the welcome screen.
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await apiService.getPlans();
        setSavedPlans(plans);
      } catch {
        setSavedPlans([]);
      }
    };
    fetchPlans();
  }, []);

  // Offline / online — DESIGN network banner (#3, #18)
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  const refreshLibrary = async () => {
    setIsLibraryLoading(true);
    setLibraryError(null);
    try {
      const plans = await apiService.getPlans();
      setSavedPlans(plans);
    } catch (err: unknown) {
      const message =
        err instanceof DaybridgeApiError
          ? err.message
          : "Couldn't load saved plans. Retry when you're back online.";
      setLibraryError(message);
    } finally {
      setIsLibraryLoading(false);
    }
  };

  // Track lg breakpoint for chat-first + plan sheet
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = () => {
      setIsNarrowViewport(mq.matches);
      if (!mq.matches) setIsPlanSheetOpen(false);
    };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Esc closes plan sheet
  useEffect(() => {
    if (!isPlanSheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPlanSheetOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlanSheetOpen]);

  const focusComposer = () => {
    setIsPlanSheetOpen(false);
    requestAnimationFrame(() => {
      document.querySelector<HTMLTextAreaElement>('[data-composer]')?.focus();
    });
  };

  const openPlanSheet = () => {
    if (isNarrowViewport || window.matchMedia('(max-width: 1023px)').matches) {
      setIsPlanSheetOpen(true);
    }
  };

  // Handle sending a chat message
  const handleSendMessage = async (text: string) => {
    if (isOffline) {
      setErrorMessage("Connection lost. Your conversation is safe. Retry when you're back online.");
      setErrorRetryable(true);
      setLastFailedSend(text);
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setErrorMessage(null);
    setLastFailedSend(null);

    try {
      const response = await apiService.sendChat({
        message: text,
        currentPlanState: activePlan || undefined,
        currentPlanId: activePlan?.id
      });

      const messageText = typeof response.message === 'string' ? response.message : response.message.text;
      const spokenText = typeof response.message === 'object' ? response.message.spoken : undefined;

      if (!messageText?.trim() && !response.plan && !response.action) {
        throw new DaybridgeApiError(
          'invalid_ai',
          "That plan didn't come through right. Try again, or rephrase your request.",
          true
        );
      }

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: messageText || "Here's what I put together.",
        spoken: spokenText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        trace: response.trace,
        action: response.action || undefined,
        plan: response.plan || undefined
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      // Draft plans land on canvas immediately; mutations wait for Confirm
      if (response.plan) {
        setActivePlan(response.plan);
        openPlanSheet();
      }
      if (
        response.action?.state === 'suggested' ||
        response.action?.state === 'awaiting_confirmation'
      ) {
        setPendingAction(response.action);
        openPlanSheet();
      }

      if (response.suggestedFollowUps && response.suggestedFollowUps.length > 0) {
        setSuggestedPrompts(response.suggestedFollowUps);
      }
    } catch (err: unknown) {
      const apiErr = err instanceof DaybridgeApiError ? err : null;
      setErrorMessage(
        apiErr?.message ||
          (err as Error)?.message ||
          "Couldn't complete request. Please try again."
      );
      setErrorRetryable(apiErr ? apiErr.retryable : true);
      setLastFailedSend(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrySend = () => {
    if (!lastFailedSend) return;
    const text = lastFailedSend;
    setErrorMessage(null);
    // Drop the last user bubble if it was the failed send (avoid duplicate)
    setChatMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === 'user' && last.content === text) {
        return prev.slice(0, -1);
      }
      return prev;
    });
    void handleSendMessage(text);
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    if (!activePlan) return;
    const updatedTasks = activePlan.tasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    const updatedPlan: Plan = {
      ...activePlan,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    };
    setActivePlan(updatedPlan);
  };

  // Update task details
  const handleUpdateTask = (updatedTask: Task) => {
    if (!activePlan) return;
    const updatedTasks = activePlan.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setActivePlan({
      ...activePlan,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    });
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    if (!activePlan) return;
    const updatedTasks = activePlan.tasks.filter((t) => t.id !== taskId);
    setActivePlan({
      ...activePlan,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    });
  };

  // Update plan title inline
  const handleUpdatePlanTitle = (newTitle: string) => {
    if (!activePlan) return;
    setActivePlan({
      ...activePlan,
      title: newTitle,
      updatedAt: new Date().toISOString()
    });
  };

  // Add new task manually
  const handleAddNewTask = () => {
    if (!activePlan) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New task',
      description: '',
      day: activePlan.tasks[0]?.day || 'Monday',
      minutes: 30,
      estimatedMinutes: 30,
      priority: 'medium',
      done: false,
      isCompleted: false,
      position: activePlan.tasks.length,
      orderIndex: activePlan.tasks.length
    };
    setActivePlan({
      ...activePlan,
      tasks: [...activePlan.tasks, newTask],
      updatedAt: new Date().toISOString()
    });
  };

  // Confirm only after backend (or explicit mock) success — truthful state
  const handleApplyAction = async (action: AssistantAction) => {
    const planPayload = action.payload?.plan as Plan | undefined;
    setPendingAction({
      ...action,
      state: 'running',
      label: 'Applying changes'
    });
    setErrorMessage(null);

    try {
      const result = await apiService.confirmAction(action.id, {
        plan: planPayload,
        summary: action.description
      });

      if (!result.ok) {
        throw new Error("Couldn't apply changes. Nothing was changed.");
      }

      const nextPlan = result.plan || planPayload;
      if (nextPlan) setActivePlan(nextPlan);

      setPendingAction({
        ...action,
        state: 'completed',
        label: 'Applied',
        description: result.summary || action.description
      });

      setChatMessages((prev) =>
        prev.map((m) => {
          if (m.action && (m.action.id === action.id || m.action.label === action.label)) {
            return {
              ...m,
              action: {
                ...m.action,
                state: 'completed',
                label: 'Applied'
              }
            };
          }
          return m;
        })
      );

      const confirmMsg: ChatMessage = {
        id: `confirm-${Date.now()}`,
        role: 'assistant',
        content: result.summary || `Applied changes to "${nextPlan?.title || 'your plan'}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: {
          id: action.id,
          type: action.type,
          label: 'Applied',
          description: result.summary || action.description,
          state: 'completed'
        }
      };
      setChatMessages((prev) => [...prev, confirmMsg]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Couldn't apply changes. Nothing was changed.";
      setErrorMessage(message);
      setPendingAction({
        ...action,
        state: 'failed',
        label: 'Failed',
        error: message,
        description: message
      });
    }
  };

  // Dismiss action
  const handleDismissAction = async () => {
    if (pendingAction?.id) {
      try {
        await apiService.cancelAction(pendingAction.id);
      } catch {
        // Dismiss locally even if cancel call fails
      }
    }
    setChatMessages((prev) =>
      prev.map((m) => {
        if (
          m.action &&
          (m.action.id === pendingAction?.id || m.action.label === pendingAction?.label)
        ) {
          return {
            ...m,
            action: {
              ...m.action,
              state: 'dismissed',
              label: 'Dismissed'
            }
          };
        }
        return m;
      })
    );
    setPendingAction(undefined);
  };

  // Propose rebalance — never mark completed until Confirm
  const handleRebalanceSchedule = () => {
    if (!activePlan) return;
    const isAlreadyChunked = activePlan.tasks.some((t) => t.chunkPart);
    if (isAlreadyChunked) {
      setPendingAction({
        id: `act-${Date.now()}`,
        type: 'reschedule_plan',
        label: 'Awaiting Confirmation',
        description: 'This will restore standard 60-minute daily capacity.',
        state: 'awaiting_confirmation',
        payload: { plan: INITIAL_INTERVIEW_PREP_PLAN }
      });
    } else {
      const rebalanced = apiService.rebalancePlan(activePlan, 30);
      setPendingAction({
        id: `act-${Date.now()}`,
        type: 'reschedule_plan',
        label: 'Awaiting Confirmation',
        description: 'This will chunk Tuesday into a 30m sprint and bump Part 2 to Wednesday.',
        state: 'awaiting_confirmation',
        payload: { plan: rebalanced }
      });
    }
  };

  // Save active plan — past tense only after success
  const handleSaveActivePlan = async () => {
    if (!activePlan || isSaving) return;
    if (isOffline) {
      setErrorMessage("Connection lost. Your conversation is safe. Retry when you're back online.");
      setErrorRetryable(true);
      return;
    }
    setErrorMessage(null);
    setIsSaving(true);
    try {
      const saved = await apiService.savePlan(activePlan);
      setActivePlan(saved);
      const plans = await apiService.getPlans();
      setSavedPlans(plans);

      const confirmMsg: ChatMessage = {
        id: `save-confirm-${Date.now()}`,
        role: 'assistant',
        content: `Saved "${saved.title}" to library.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: {
          id: `act-save-${Date.now()}`,
          type: 'update_plan',
          label: 'Saved',
          description: 'Plan stored successfully',
          state: 'completed'
        }
      };
      setChatMessages((prev) => [...prev, confirmMsg]);
      setToastMessage('Saved to library.');
    } catch (err: unknown) {
      const message =
        err instanceof DaybridgeApiError
          ? err.message
          : (err as Error)?.message || "Couldn't save the plan. Nothing was changed.";
      setErrorMessage(message);
      setErrorRetryable(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Select a plan from saved drawer
  const handleSelectPlan = (plan: Plan) => {
    setActivePlan(plan);
    setPendingAction(undefined);
    setIsSavedDrawerOpen(false);
    openPlanSheet();
  };

  // Delete a plan from saved list
  const handleDeletePlan = async (planId: string) => {
    await apiService.deletePlan(planId);
    const updated = await apiService.getPlans();
    setSavedPlans(updated);
    if (activePlan?.id === planId) {
      setActivePlan(updated[0] || null);
    }
  };

  // Reset conversation
  const handleResetSession = () => {
    setChatMessages([]);
    setActivePlan(null);
    setPendingAction(undefined);
    setIsPlanSheetOpen(false);
  };

  const isCurrentPlanSaved = savedPlans.some((p) => p.id === activePlan?.id);
  const fabNeedsAttention =
    pendingAction?.state === 'awaiting_confirmation' || pendingAction?.state === 'failed';
  const fabTaskCount = activePlan?.tasks?.length ?? 0;
  const shellRef = useRef<HTMLDivElement>(null);
  const planSheetRef = useRef<HTMLElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Plan sheet open — DESIGN: slides up ease.enter (slow)
  useGSAP(
    () => {
      if (!isNarrowViewport || !isPlanSheetOpen || !planSheetRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          planSheetRef.current,
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: motion.slow, ease: motion.enter }
        );
        gsap.fromTo(
          '.plan-sheet-scrim',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: motion.base, ease: motion.standard }
        );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.fromTo(planSheetRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: motion.fast });
      });
      return () => mm.revert();
    },
    { scope: shellRef, dependencies: [isPlanSheetOpen, isNarrowViewport] }
  );

  // Plan FAB entrance when sheet is closed
  useGSAP(
    () => {
      if (!isNarrowViewport || isPlanSheetOpen || !fabRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          fabRef.current,
          { y: 10, autoAlpha: 0, scale: 0.96 },
          { y: 0, autoAlpha: 1, scale: 1, duration: motion.base, ease: motion.enter }
        );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.fromTo(fabRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: motion.fast });
      });
      return () => mm.revert();
    },
    { scope: shellRef, dependencies: [isNarrowViewport, isPlanSheetOpen] }
  );

  if (isDesignSystemOpen) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-canvas)', overflowY: 'auto' }}>
        <TokenSwatchPage onBack={() => setIsDesignSystemOpen(false)} />
      </div>
    );
  }

  return (
    <div className="app-shell" ref={shellRef}>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <Logo size="md" showWordmark={true} />
        </div>

        <div className="app-header-actions">
          <button
            type="button"
            className="app-header-btn app-header-btn--primary"
            onClick={handleResetSession}
            title="Start a new plan"
            aria-label="New plan"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span className="btn-label">New plan</span>
          </button>

          <button
            type="button"
            className="app-header-btn app-header-btn--sunken"
            onClick={() => {
              setIsSavedDrawerOpen(true);
              void refreshLibrary();
            }}
            aria-label={`Saved plans, ${savedPlans.length}`}
          >
            <Bookmark size={14} />
            <span className="btn-label">Saved plans</span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '11px',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-text-primary)',
                padding: '1px 6px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600
              }}
            >
              {savedPlans.length}
            </span>
          </button>

          <button
            type="button"
            className="app-header-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          <button
            type="button"
            className="app-header-btn app-header-btn--ghost app-header-btn--reset"
            onClick={handleResetSession}
            aria-label="Reset conversation"
            title="Reset conversation"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      <OfflineBanner isOffline={isOffline} />

      <main className="studio">
        <section className="studio-chat is-active" aria-label="Assistant">
          <div className="studio-chat__inner">
            <ChatPanel
              messages={chatMessages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onApplyAction={handleApplyAction}
              onDismissError={() => {
                setErrorMessage(null);
                setLastFailedSend(null);
              }}
              onRetryError={handleRetrySend}
              suggestedPrompts={suggestedPrompts}
              error={errorMessage}
              errorRetryable={errorRetryable && Boolean(lastFailedSend)}
            />
          </div>
        </section>

        {isNarrowViewport && isPlanSheetOpen && (
          <button
            type="button"
            className="plan-sheet-scrim"
            aria-label="Close plan"
            onClick={() => setIsPlanSheetOpen(false)}
          />
        )}

        <section
          ref={planSheetRef}
          className={`studio-plan${isPlanSheetOpen ? ' is-sheet-open' : ''}`}
          aria-label="Plan"
          role={isNarrowViewport ? 'dialog' : undefined}
          aria-modal={isNarrowViewport && isPlanSheetOpen ? true : undefined}
          aria-hidden={isNarrowViewport && !isPlanSheetOpen}
        >
          {isNarrowViewport && (
            <div className="plan-sheet-chrome">
              <div className="plan-sheet-handle" aria-hidden="true" />
              <div className="plan-sheet-chrome__row">
                <span className="plan-sheet-chrome__title">Plan</span>
                <button
                  type="button"
                  className="app-header-btn app-header-btn--ghost"
                  onClick={() => setIsPlanSheetOpen(false)}
                  aria-label="Close plan"
                >
                  <X size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          )}
          <div className="studio-plan__body">
            <PlanCanvas
              plan={activePlan}
              pendingAction={pendingAction}
              isSaved={isCurrentPlanSaved}
              isLoading={isLoading}
              isSaving={isSaving}
              onSavePlan={handleSaveActivePlan}
              onToggleTask={handleToggleTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onApplyAction={handleApplyAction}
              onDismissAction={handleDismissAction}
              onRebalanceSchedule={handleRebalanceSchedule}
              onAddNewTask={handleAddNewTask}
              onUpdatePlanTitle={handleUpdatePlanTitle}
              onAskForPlan={focusComposer}
            />
          </div>
        </section>
      </main>

      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />

      {/* Mobile FAB — Plan destination. Desktop uses pinned pane (no FAB). */}
      {isNarrowViewport && !isPlanSheetOpen && (
        <button
          ref={fabRef}
          type="button"
          className={`plan-fab${fabNeedsAttention ? ' plan-fab--attention' : ''}`}
          onClick={() => setIsPlanSheetOpen(true)}
          aria-label={
            fabNeedsAttention
              ? 'Open plan — confirmation needed'
              : activePlan
              ? `Open plan, ${fabTaskCount} tasks`
              : 'Open plan'
          }
        >
          <LayoutList size={20} strokeWidth={1.75} />
          <span>Plan</span>
          {fabNeedsAttention ? (
            <span className="plan-fab__badge plan-fab__badge--dot" aria-hidden="true" />
          ) : fabTaskCount > 0 ? (
            <span className="plan-fab__badge tabular-nums">{fabTaskCount}</span>
          ) : null}
        </button>
      )}

      <SavedPlansDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPlans={savedPlans}
        activePlanId={activePlan?.id}
        onSelectPlan={handleSelectPlan}
        onDeletePlan={handleDeletePlan}
        isLoading={isLibraryLoading}
        error={libraryError}
        onRetry={refreshLibrary}
      />
    </div>
  );
};

export default App;
