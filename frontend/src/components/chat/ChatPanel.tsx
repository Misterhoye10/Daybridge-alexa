import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, AssistantAction } from '../../types/daybridge';
import { ActionBadge } from '../common/ActionBadge';
import { PipelineTrace } from '../common/PipelineTrace';
import type { PipelineStage } from '../common/PipelineTrace';
import { DiffRow } from '../primitives/DiffRow';
import { Logo } from '../brand/Logo';
import { ArrowUp, Mic, AlertCircle, Check, ArrowRight } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onApplyAction?: (action: AssistantAction) => void;
  suggestedPrompts?: string[];
  error?: string | null;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onApplyAction,
  suggestedPrompts = [],
  error
}) => {
  const [inputText, setInputText] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea height to accommodate up to 5 lines comfortably
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [inputText]);

  // Global keyboard shortcut: "/" or "Cmd+K" to focus composer
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement;

      if (!isInputActive) {
        if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
          e.preventDefault();
          textareaRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleToggleVoice = () => {
    if (isVoiceListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore error on stop
        }
      }
      setIsVoiceListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsVoiceListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          setInputText(transcript);
        };

        recognition.onerror = () => {
          setIsVoiceListening(false);
        };

        recognition.onend = () => {
          setIsVoiceListening(false);
          textareaRef.current?.focus();
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch {
        // Fallback gracefully to demo simulation
      }
    }

    // Graceful fallback for environments without microphone permissions or Web Speech API
    setIsVoiceListening(true);
    setTimeout(() => {
      setIsVoiceListening(false);
      setInputText(
        'Help me prepare for a software engineering interview on Friday. I have one hour each evening.'
      );
      textareaRef.current?.focus();
    }, 1200);
  };

  const pipelineStage: PipelineStage = isVoiceListening
    ? 'heard'
    : isLoading
    ? 'acting'
    : 'idle';

  const isInitialState = messages.length === 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-bg-surface)',
        overflow: 'hidden'
      }}
    >
      {/* Calm Header with Pipeline Cue */}
      <div
        style={{
          padding: '14px 24px',
          borderBottom: '1px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-bg-surface)',
          minHeight: '52px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: 'var(--font-size-label)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Assistant
          </span>
          <span style={{ color: 'var(--color-border-strong)' }}>·</span>
          <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-tertiary)', margin: 0 }}>
            {isVoiceListening ? 'Listening...' : isLoading ? 'Structuring plan...' : 'Turn intentions into action'}
          </p>
        </div>

        {/* Pipeline Trace indicator */}
        <PipelineTrace stage={pipelineStage} toolName={isLoading ? 'create_plan' : undefined} />
      </div>

      {/* Messages Feed */}
      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversation thread"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Welcome Block (The 30-Second Test - Section 9) */}
        {isInitialState && (
          <div
            style={{
              padding: '12px 0 16px',
              borderBottom: '1px solid var(--color-border-default)',
              marginBottom: '4px'
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '6px',
                letterSpacing: '-0.02em'
              }}
            >
              What do you want to get done?
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                lineHeight: '22px',
                margin: '0 0 16px 0'
              }}
            >
              Tell me the goal and how much time you have. I'll build the plan.
            </p>

            {/* Prominent Stacked PromptChips (44px high each, full-width) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  style={{
                    minHeight: '44px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-default)',
                    backgroundColor: 'var(--color-bg-sunken)',
                    color: 'var(--color-text-primary)',
                    fontSize: '13px',
                    lineHeight: '18px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all var(--duration-fast) var(--ease-standard)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-action-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-default)';
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-sunken)';
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{prompt}</span>
                  <ArrowRight size={14} color="var(--color-action-primary)" style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '85%' : '100%',
                alignItems: 'flex-start'
              }}
            >
              {!isUser && (
                <div style={{ marginTop: '3px', flexShrink: 0 }}>
                  <Logo size="sm" showWordmark={false} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', width: '100%' }}>
                {isUser ? (
                  // User: Sunken bubble, right-aligned, 80-85% max
                  <div
                    style={{
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: 'var(--color-bg-sunken)',
                      border: '1px solid var(--color-border-default)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-body-lg)',
                      lineHeight: 'var(--line-height-body-lg)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {msg.content}
                  </div>
                ) : (
                  // Assistant: No speech bubble, clean editorial typography
                  <div
                    style={{
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-body-lg)',
                      lineHeight: 'var(--line-height-body-lg)',
                      whiteSpace: 'pre-wrap',
                      width: '100%'
                    }}
                  >
                    {msg.content}

                    {/* Inline Action Card if message executed or suggested an action */}
                    {msg.action && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '14px 16px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor:
                            msg.action.state === 'suggested'
                              ? 'var(--color-state-suggested-bg)'
                              : msg.action.state === 'awaiting_confirmation'
                              ? 'var(--color-state-awaiting-bg)'
                              : msg.action.state === 'completed'
                              ? 'var(--color-state-completed-bg)'
                              : 'var(--color-bg-surface)',
                          border: `1px solid ${
                            msg.action.state === 'suggested'
                              ? 'var(--color-state-suggested-border)'
                              : msg.action.state === 'awaiting_confirmation'
                              ? 'var(--color-state-awaiting-border)'
                              : msg.action.state === 'completed'
                              ? 'var(--color-state-completed-border)'
                              : 'var(--color-border-default)'
                          }`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <ActionBadge state={msg.action.state} label={msg.action.label} size="sm" />
                        </div>
                        <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', margin: 0 }}>
                          {msg.action.description}
                        </p>

                        {/* Proposed Diff Rows if changes are listed */}
                        {msg.action.changes && msg.action.changes.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                            {msg.action.changes.map((ch, idx) => (
                              <DiffRow
                                key={idx}
                                field={ch.title}
                                before={ch.before?.estimatedMinutes ? `${ch.before.estimatedMinutes}m` : undefined}
                                after={ch.detail || (ch.after?.estimatedMinutes ? `${ch.after.estimatedMinutes}m` : '')}
                                changeType={ch.kind === 'changed' ? 'modified' : ch.kind}
                              />
                            ))}
                          </div>
                        )}

                        {(msg.action.state === 'suggested' || msg.action.state === 'awaiting_confirmation') && onApplyAction && (
                          <button
                            onClick={() => onApplyAction(msg.action!)}
                            style={{
                              alignSelf: 'flex-start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginTop: '4px',
                              padding: '6px 14px',
                              backgroundColor: 'var(--color-action-primary)',
                              color: 'var(--color-action-on-primary)',
                              border: 'none',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--font-size-label)',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <Check size={13} /> Confirm changes
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <span
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-tertiary)',
                    marginTop: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Logo size="sm" />
            <span style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
              Building your plan...
            </span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-state-failed-bg)',
              border: '1px solid var(--color-state-failed-border)',
              color: 'var(--color-state-failed-text)',
              fontSize: 'var(--font-size-body)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Follow-up Chips for Active Conversation */}
      {!isInitialState && suggestedPrompts.length > 0 && (
        <div
          style={{
            padding: '8px 24px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            backgroundColor: 'var(--color-bg-surface)',
            borderTop: '1px solid var(--color-border-default)'
          }}
        >
          {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-bg-sunken)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-pill)',
                padding: '5px 12px',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-standard)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-action-primary)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-default)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Composer Input Form (56px min height per Section 7 & 8) */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 24px',
          borderTop: isInitialState || suggestedPrompts.length === 0 ? '1px solid var(--color-border-default)' : 'none',
          backgroundColor: 'var(--color-bg-surface)',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end',
          minHeight: '56px'
        }}
      >
        <button
          type="button"
          onClick={handleToggleVoice}
          title={isVoiceListening ? 'Stop listening' : 'Voice request (Web Speech API)'}
          aria-label="Voice input"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: isVoiceListening ? 'var(--color-state-awaiting-bg)' : 'var(--color-bg-sunken)',
            border: `1px solid ${isVoiceListening ? 'var(--color-state-awaiting-border)' : 'var(--color-border-default)'}`,
            color: isVoiceListening ? 'var(--color-state-awaiting-text)' : 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all var(--duration-fast) var(--ease-standard)'
          }}
        >
          <Mic size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Say it or type it... (Press / to focus, Shift+Enter for newline)"
          disabled={isLoading}
          rows={1}
          style={{
            flex: 1,
            minHeight: '44px',
            maxHeight: '120px',
            backgroundColor: 'var(--color-bg-sunken)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-xl)',
            padding: '10px 16px',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-body-lg)',
            outline: 'none',
            resize: 'none',
            lineHeight: '22px',
            fontFamily: 'var(--font-ui)',
            transition: 'border-color var(--duration-fast) var(--ease-standard)'
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-focus-ring)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-default)')}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          title="Send request"
          aria-label="Send request"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: inputText.trim() && !isLoading ? 'var(--color-action-primary)' : 'var(--color-bg-sunken)',
            color: inputText.trim() && !isLoading ? 'var(--color-action-on-primary)' : 'var(--color-text-tertiary)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'default',
            flexShrink: 0,
            transition: 'all var(--duration-fast) var(--ease-standard)'
          }}
        >
          <ArrowUp size={18} />
        </button>
      </form>
    </div>
  );
};
