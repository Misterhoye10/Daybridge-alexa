import React, { useState, useEffect } from 'react';
import type { Plan, Task, ChatMessage, AssistantAction } from './types/daybridge';
import { Logo } from './components/brand/Logo';
import { ChatPanel } from './components/chat/ChatPanel';
import { PlanCanvas } from './components/plan/PlanCanvas';
import { SavedPlansDrawer } from './components/saved/SavedPlansDrawer';
import { TokenSwatchPage } from './components/design-system/TokenSwatchPage';
import { apiService, INITIAL_INTERVIEW_PREP_PLAN } from './services/api';
import { useTheme } from './context/ThemeContext';
import { Bookmark, RotateCcw, MessageSquare, LayoutGrid, Palette, Sun, Moon, Plus } from 'lucide-react';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<AssistantAction | undefined>(undefined);
  const [mobileTab, setMobileTab] = useState<'chat' | 'plan'>('chat');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    'Help me prepare for a software engineering interview on Friday. I have one hour each evening.',
    'Start planning ritual',
    'Review workload capacity',
    'Make the first day easier and add a mock interview',
    'Start daily shutdown'
  ]);

  // Load saved plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      const plans = await apiService.getPlans();
      setSavedPlans(plans);
    };
    fetchPlans();
  }, []);

  // Handle sending a chat message
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiService.sendChat({
        message: text,
        currentPlanState: activePlan || undefined,
        currentPlanId: activePlan?.id
      });

      const messageText = typeof response.message === 'string' ? response.message : response.message.text;
      const spokenText = typeof response.message === 'object' ? response.message.spoken : undefined;

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: messageText,
        spoken: spokenText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        trace: response.trace,
        action: response.action || undefined,
        plan: response.plan || undefined
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      if (response.plan) {
        if (response.action?.state === 'suggested' || response.action?.state === 'awaiting_confirmation') {
          setPendingAction(response.action);
        } else {
          setActivePlan(response.plan);
          if (response.action) setPendingAction(response.action);
        }
      } else if (response.action?.state === 'awaiting_confirmation') {
        setPendingAction(response.action);
      }

      if (response.suggestedFollowUps && response.suggestedFollowUps.length > 0) {
        setSuggestedPrompts(response.suggestedFollowUps);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Couldn't complete request. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  // Apply suggested action
  const handleApplyAction = (action: AssistantAction) => {
    if (action.payload?.plan) {
      setActivePlan(action.payload.plan);
    }
    setPendingAction({
      ...action,
      state: 'completed',
      label: 'Applied'
    });
  };

  // Dismiss action
  const handleDismissAction = () => {
    setPendingAction(undefined);
  };

  // Motion auto-cascade rebalance
  const handleRebalanceSchedule = () => {
    if (!activePlan) return;
    const isAlreadyChunked = activePlan.tasks.some((t) => t.chunkPart);
    if (isAlreadyChunked) {
      setActivePlan(INITIAL_INTERVIEW_PREP_PLAN);
      const restoreAction: AssistantAction = {
        id: `act-${Date.now()}`,
        type: 'reschedule_plan',
        label: 'Schedule Restored',
        description: 'Restored standard 60-minute daily capacity',
        state: 'completed',
        payload: INITIAL_INTERVIEW_PREP_PLAN
      };
      setPendingAction(restoreAction);
    } else {
      const rebalanced = apiService.rebalancePlan(activePlan, 30);
      setActivePlan(rebalanced);
      const cascadeAction: AssistantAction = {
        id: `act-${Date.now()}`,
        type: 'reschedule_plan',
        label: 'Motion Cascade Applied',
        description: 'Chunked Tuesday into 30m sprint and bumped Part 2 to Wednesday',
        state: 'completed',
        payload: rebalanced
      };
      setPendingAction(cascadeAction);
    }
  };

  // Save active plan
  const handleSaveActivePlan = async () => {
    if (!activePlan) return;
    await apiService.savePlan(activePlan);
    const plans = await apiService.getPlans();
    setSavedPlans(plans);

    const confirmMsg: ChatMessage = {
      id: `save-confirm-${Date.now()}`,
      role: 'assistant',
      content: `Saved "${activePlan.title}" to library.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: {
        id: `act-save-${Date.now()}`,
        type: 'update_plan',
        label: 'Saved',
        description: 'Synchronized with local storage',
        state: 'completed'
      }
    };
    setChatMessages((prev) => [...prev, confirmMsg]);
  };

  // Select a plan from saved drawer
  const handleSelectPlan = (plan: Plan) => {
    setActivePlan(plan);
    setPendingAction(undefined);
    setMobileTab('plan');
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
  };

  const isCurrentPlanSaved = savedPlans.some((p) => p.id === activePlan?.id);

  if (isDesignSystemOpen) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-canvas)', overflowY: 'auto' }}>
        <TokenSwatchPage onBack={() => setIsDesignSystemOpen(false)} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'var(--color-bg-canvas)',
        color: 'var(--color-text-primary)',
        overflow: 'hidden',
        fontFamily: 'var(--font-ui)'
      }}
    >
      {/* Top Brand Navigation Header */}
      {/* Top Brand Navigation Header (56px per Section 7) */}
      <header
        style={{
          height: '56px',
          borderBottom: '1px solid var(--color-border-default)',
          backgroundColor: 'var(--color-bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Logo size="md" showWordmark={true} />
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* New Plan Trigger */}
          <button
            onClick={handleResetSession}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-action-primary)',
              color: 'var(--color-action-on-primary)',
              border: 'none',
              fontSize: 'var(--font-size-label)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-standard)'
            }}
            title="Start a new plan"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New plan</span>
          </button>

          {/* Saved Plans */}
          <button
            onClick={() => setIsSavedDrawerOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-sunken)',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-label)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-standard)'
            }}
          >
            <Bookmark size={14} />
            <span>Saved plans</span>
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

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-label)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-standard)'
            }}
            title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Design System Swatches */}
          <button
            onClick={() => setIsDesignSystemOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-tertiary)',
              fontSize: 'var(--font-size-label)',
              cursor: 'pointer'
            }}
            title="Design System & Tokens"
          >
            <Palette size={14} />
          </button>

          {/* Reset Session */}
          <button
            onClick={handleResetSession}
            title="Reset conversation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div
        className="mobile-tab-bar"
        style={{
          display: 'none',
          padding: '8px 16px',
          borderBottom: '1px solid var(--color-border-default)',
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        <button
          onClick={() => setMobileTab('chat')}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: mobileTab === 'chat' ? 'var(--color-action-primary)' : 'transparent',
            color: mobileTab === 'chat' ? 'var(--color-action-on-primary)' : 'var(--color-text-secondary)',
            fontWeight: 600,
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: 'var(--font-size-label)'
          }}
        >
          <MessageSquare size={14} /> Assistant
        </button>
        <button
          onClick={() => setMobileTab('plan')}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: mobileTab === 'plan' ? 'var(--color-action-primary)' : 'transparent',
            color: mobileTab === 'plan' ? 'var(--color-action-on-primary)' : 'var(--color-text-secondary)',
            fontWeight: 600,
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: 'var(--font-size-label)'
          }}
        >
          <LayoutGrid size={14} /> Plan
        </button>
      </div>

      {/* Main Studio Workspace (Single surface divided by 1px hairline per Section 1 & 7) */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          height: 'calc(100vh - 56px)',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        {/* Left Pane: Conversational Assistant Studio (720px max column) */}
        <section
          style={{
            flex: 1,
            height: '100%',
            overflow: 'hidden',
            borderRight: '1px solid var(--color-border-default)',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '100%', maxWidth: '720px', height: '100%' }}>
            <ChatPanel
              messages={chatMessages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onApplyAction={handleApplyAction}
              suggestedPrompts={suggestedPrompts}
              error={errorMessage}
            />
          </div>
        </section>

        {/* Right Pane: Live Interactive Plan Document Studio */}
        <section
          style={{
            width: '500px',
            flexShrink: 0,
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-surface)'
          }}
        >
          <PlanCanvas
            plan={activePlan}
            pendingAction={pendingAction}
            isSaved={isCurrentPlanSaved}
            onSavePlan={handleSaveActivePlan}
            onToggleTask={handleToggleTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onApplyAction={handleApplyAction}
            onDismissAction={handleDismissAction}
            onRebalanceSchedule={handleRebalanceSchedule}
            onAddNewTask={handleAddNewTask}
            onUpdatePlanTitle={handleUpdatePlanTitle}
          />
        </section>
      </main>

      {/* Saved Plans Drawer */}
      <SavedPlansDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPlans={savedPlans}
        activePlanId={activePlan?.id}
        onSelectPlan={handleSelectPlan}
        onDeletePlan={handleDeletePlan}
      />
    </div>
  );
};

export default App;
