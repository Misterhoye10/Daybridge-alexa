import { useState, useEffect } from 'react';
import type { Plan, Task, ChatMessage, AssistantAction } from './types/daybridge';
import { Logo } from './components/brand/Logo';
import { ChatPanel } from './components/chat/ChatPanel';
import { PlanCanvas } from './components/plan/PlanCanvas';
import { SavedPlansDrawer } from './components/saved/SavedPlansDrawer';
import { apiService, INITIAL_INTERVIEW_PREP_PLAN } from './services/api';
import { Bookmark, RotateCcw, MessageSquare, LayoutGrid, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activePlan, setActivePlan] = useState<Plan | null>(INITIAL_INTERVIEW_PREP_PLAN);
  const [savedPlans, setSavedPlans] = useState<Plan[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<AssistantAction | undefined>(undefined);
  const [mobileTab, setMobileTab] = useState<'chat' | 'plan'>('chat');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Welcome to Daybridge. Tell me your intention or deadline, and I will structure it into an actionable plan.',
      timestamp: 'Just now'
    }
  ]);

  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    'Help me prepare for a software engineering interview on Friday. I have one hour each evening.',
    'Make the first day easier and add a mock interview',
    'I only have 30 minutes today. Adjust my schedule'
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

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action,
        plan: response.plan
      };

      setChatMessages((prev) => [...prev, assistantMsg]);

      // If response includes a plan
      if (response.plan) {
        if (response.action?.state === 'suggested') {
          // Keep active plan, set pending action for user approval
          setPendingAction(response.action);
        } else {
          // Immediately apply if confirmed or created
          setActivePlan(response.plan);
          if (response.action) setPendingAction(response.action);
        }
      }

      if (response.suggestedFollowUps && response.suggestedFollowUps.length > 0) {
        setSuggestedPrompts(response.suggestedFollowUps);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to communicate with the assistant. Please try again.');
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

  // Apply suggested action
  const handleApplyAction = (action: AssistantAction) => {
    if (action.payload?.plan) {
      setActivePlan(action.payload.plan);
    }
    setPendingAction({
      ...action,
      state: 'completed',
      label: 'Action Applied'
    });
  };

  // Dismiss action
  const handleDismissAction = () => {
    setPendingAction(undefined);
  };

  // Save active plan
  const handleSaveActivePlan = async () => {
    if (!activePlan) return;
    await apiService.savePlan(activePlan);
    const plans = await apiService.getPlans();
    setSavedPlans(plans);

    // Add confirmation message in chat
    const confirmMsg: ChatMessage = {
      id: `save-confirm-${Date.now()}`,
      role: 'assistant',
      content: `Your plan "${activePlan.title}" has been saved. You can access it anytime from the Saved Plans drawer.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: {
        id: `act-save-${Date.now()}`,
        type: 'update_plan',
        label: 'Plan Saved',
        description: 'Synchronized with persistent storage',
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

  // Start a fresh conversation
  const handleResetSession = () => {
    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Session reset. What goal or deadline would you like to tackle today?',
        timestamp: 'Just now'
      }
    ]);
    setActivePlan(null);
    setPendingAction(undefined);
  };

  const isCurrentPlanSaved = savedPlans.some((p) => p.id === activePlan?.id);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
        overflow: 'hidden'
      }}
    >
      {/* Top Brand Navigation Header */}
      <header
        style={{
          height: '64px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(11, 15, 26, 0.95)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Logo size="md" />
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--brand-teal)',
              backgroundColor: 'rgba(0, 212, 170, 0.08)',
              border: '1px solid rgba(0, 212, 170, 0.25)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.04em'
            }}
          >
            <Sparkles size={11} /> ALEXA+ SIMULATION
          </span>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsSavedDrawerOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFF';
              e.currentTarget.style.borderColor = 'var(--brand-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <Bookmark size={14} />
            <span>Saved Plans</span>
            <span
              style={{
                fontSize: '0.7rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {savedPlans.length}
            </span>
          </button>

          <button
            onClick={handleResetSession}
            title="Reset conversation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '7px 10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div
        className="mobile-tab-bar"
        style={{
          display: 'none',
          padding: '8px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <button
          onClick={() => setMobileTab('chat')}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: mobileTab === 'chat' ? 'var(--brand-gradient)' : 'transparent',
            color: mobileTab === 'chat' ? '#0B0F1A' : 'var(--text-secondary)',
            fontWeight: 700,
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.82rem'
          }}
        >
          <MessageSquare size={14} /> Alexa+ Assistant
        </button>
        <button
          onClick={() => setMobileTab('plan')}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: mobileTab === 'plan' ? 'var(--brand-gradient)' : 'transparent',
            color: mobileTab === 'plan' ? '#0B0F1A' : 'var(--text-secondary)',
            fontWeight: 700,
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.82rem'
          }}
        >
          <LayoutGrid size={14} /> Interactive Plan
        </button>
      </div>

      {/* Main Split-Screen Workspace (Desktop) */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(380px, 42%) minmax(450px, 58%)',
          gap: '20px',
          padding: '20px 24px',
          overflow: 'hidden'
        }}
      >
        {/* Left Pane: Alexa+ Conversational Assistant */}
        <section style={{ height: '100%', overflow: 'hidden' }}>
          <ChatPanel
            messages={chatMessages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onApplyAction={handleApplyAction}
            suggestedPrompts={suggestedPrompts}
            error={errorMessage}
          />
        </section>

        {/* Right Pane: Live Interactive Plan Canvas */}
        <section style={{ height: '100%', overflow: 'hidden' }}>
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
