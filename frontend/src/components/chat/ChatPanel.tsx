import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, AssistantAction } from '../../types/daybridge';
import { ActionBadge } from '../common/ActionBadge';
import { Send, Mic, Sparkles, AlertCircle, Bot, User, CheckCircle2 } from 'lucide-react';

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
  const [isSimulatedListening, setIsSimulatedListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleSimulateVoice = () => {
    setIsSimulatedListening(true);
    setTimeout(() => {
      setIsSimulatedListening(false);
      setInputText('Help me prepare for a software engineering interview on Friday. I have one hour each evening.');
    }, 1200);
  };

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
      {/* Alexa+ Ambient Status Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, rgba(14, 165, 233, 0) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Animated Alexa+ Ring Orb */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isLoading || isSimulatedListening ? 'var(--alexa-glow-strong)' : 'var(--alexa-glow)',
              transition: 'all var(--transition-normal)',
              animation: isLoading ? 'pulse 1.8s infinite' : 'none'
            }}
          >
            <Sparkles size={14} color="#0B0F1A" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFF' }}>Alexa+ Assistant</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--brand-teal)',
                  backgroundColor: 'rgba(0, 212, 170, 0.1)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600
                }}
              >
                SIMULATED
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isSimulatedListening ? 'Listening to voice...' : isLoading ? 'Structuring response...' : 'Ready for your request'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              maxWidth: '320px',
              padding: '20px'
            }}
          >
            <Bot size={36} color="var(--brand-cyan)" style={{ marginBottom: '12px', opacity: 0.8 }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: '#FFF' }}>
              Say it. Plan it. Get it done.
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Ask me to build a realistic timeline, organize an interview prep schedule, or adjust existing tasks.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '10px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '88%'
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(14, 165, 233, 0.15)',
                    border: '1px solid var(--border-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Bot size={14} color="var(--brand-cyan)" />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    borderTopRightRadius: isUser ? '2px' : 'var(--radius-lg)',
                    borderTopLeftRadius: !isUser ? '2px' : 'var(--radius-lg)',
                    backgroundColor: isUser ? 'rgba(14, 165, 233, 0.2)' : 'var(--bg-card)',
                    border: `1px solid ${isUser ? 'rgba(14, 165, 233, 0.4)' : 'var(--border-subtle)'}`,
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.content}

                  {/* Inline Action Card if message executed or suggested an action */}
                  {msg.action && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid var(--border-medium)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <ActionBadge state={msg.action.state} label={msg.action.label} size="sm" />
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {msg.action.description}
                      </p>
                      {msg.action.state === 'suggested' && onApplyAction && (
                        <button
                          onClick={() => onApplyAction(msg.action!)}
                          style={{
                            alignSelf: 'flex-start',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px',
                            padding: '4px 10px',
                            backgroundColor: '#FDBA74',
                            color: '#1A1208',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <CheckCircle2 size={11} /> Confirm & Update Plan
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-dim)',
                    marginTop: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>

              {isUser && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <User size={14} color="#FFF" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid var(--border-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={14} color="var(--brand-cyan)" />
            </div>
            <div
              style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '5px',
                alignItems: 'center'
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-cyan)', animation: 'bounce 1s infinite 0ms' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-teal)', animation: 'bounce 1s infinite 200ms' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-cyan)', animation: 'bounce 1s infinite 400ms' }} />
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid var(--state-failed-border)',
              color: 'var(--state-failed-text)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (PRD Section 5.1 & 10) */}
      {suggestedPrompts.length > 0 && (
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              disabled={isLoading}
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-cyan)';
                e.currentTarget.style.color = '#FFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Sparkles size={11} color="var(--brand-teal)" />
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'rgba(18, 24, 38, 0.95)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        <button
          type="button"
          onClick={handleSimulateVoice}
          title="Simulate Alexa voice command"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isSimulatedListening ? 'rgba(0, 212, 170, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${isSimulatedListening ? 'var(--brand-teal)' : 'var(--border-subtle)'}`,
            color: isSimulatedListening ? 'var(--brand-teal)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'var(--transition-fast)'
          }}
        >
          <Mic size={16} />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Alexa+ to plan, reschedule, or add a task..."
          disabled={isLoading}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            color: '#FFFFFF',
            fontSize: '0.88rem',
            outline: 'none',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--brand-cyan)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: inputText.trim() && !isLoading ? 'var(--brand-gradient)' : 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: inputText.trim() && !isLoading ? '#0B0F1A' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'default',
            flexShrink: 0,
            transition: 'var(--transition-fast)'
          }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
