import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, AssistantAction } from '../../types/daybridge';
import { ActionBadge } from '../common/ActionBadge';
import { PipelineTrace } from '../common/PipelineTrace';
import { DiffRow } from '../primitives/DiffRow';
import { Logo } from '../brand/Logo';
import {
  ArrowUp,
  Mic,
  AlertCircle,
  Check,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';
import { gsap, useGSAP } from '../../motion/setup';
import { motion, RISE_Y } from '../../motion/tokens';
import { hasSpeechRecognition, hasSpeechSynthesis, type SpeechRecognitionLike } from '../../voice/detect';
import { VOICE_COPY } from '../../voice/copy';
import {
  isVoiceOutPreferred,
  setVoiceOutPreferred,
  speakSpoken,
  stopSpeaking,
  isSpeaking
} from '../../voice/tts';
import { startSpeechRecognition, stopSpeechRecognition } from '../../voice/stt';
import { usePipelinePlayback } from '../../hooks/usePipelinePlayback';
import type { JudgeScenario } from '../../data/judgeScenarios';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onApplyAction?: (action: AssistantAction) => void;
  onDismissError?: () => void;
  onRetryError?: () => void;
  suggestedPrompts?: string[];
  error?: string | null;
  errorRetryable?: boolean;
  judgeScenarios?: JudgeScenario[];
  onJudgeScenario?: (scenario: JudgeScenario) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onApplyAction,
  onDismissError,
  onRetryError,
  suggestedPrompts = [],
  error,
  errorRetryable = true,
  judgeScenarios = [],
  onJudgeScenario
}) => {
  const [inputText, setInputText] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [sttSupported] = useState(() => hasSpeechRecognition());
  const [ttsSupported] = useState(() => hasSpeechSynthesis());
  const [voiceOutOn, setVoiceOutOn] = useState(() => isVoiceOutPreferred());
  const [isTtsSpeaking, setIsTtsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const prevMsgCount = useRef(0);
  const lastSpokenId = useRef<string | null>(null);

  const pipeline = usePipelinePlayback({
    isListening: isVoiceListening,
    isLoading,
    hasError: Boolean(error) && !isLoading,
    toolName: 'create_plan'
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea within the unified composer shell
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '40px';
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 40), 120)}px`;
  }, [inputText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
  }, []);

  // TTS — speak short `spoken` only when Voice on (#18, API_CONTRACT)
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant' || !last.spoken) return;
    if (last.id === lastSpokenId.current) return;
    lastSpokenId.current = last.id;
    if (!voiceOutOn || !ttsSupported) return;
    speakSpoken(last.spoken);
    setIsTtsSpeaking(true);
    const poll = window.setInterval(() => {
      if (!isSpeaking()) {
        setIsTtsSpeaking(false);
        window.clearInterval(poll);
      }
    }, 200);
    return () => window.clearInterval(poll);
  }, [messages, voiceOutOn, ttsSupported]);

  useEffect(() => {
    return () => {
      stopSpeechRecognition(recognitionRef.current);
      stopSpeaking();
    };
  }, []);

  const isInitialState = messages.length === 0;

  const handleToggleVoiceOut = useCallback(() => {
    if (isTtsSpeaking) {
      stopSpeaking();
      setIsTtsSpeaking(false);
      return;
    }
    const next = !voiceOutOn;
    setVoiceOutOn(next);
    setVoiceOutPreferred(next);
  }, [voiceOutOn, isTtsSpeaking]);

  // Welcome entrance — DESIGN: fade up 8px, stagger chips (GSAP + reduced-motion)
  useGSAP(
    () => {
      if (!isInitialState) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.chat-welcome-title, .chat-welcome-support', {
          y: RISE_Y,
          autoAlpha: 0,
          duration: motion.slow,
          stagger: 0.05,
          ease: motion.enter
        });
        gsap.from('.prompt-chip', {
          y: RISE_Y,
          autoAlpha: 0,
          duration: motion.base,
          stagger: 0.05,
          delay: 0.06,
          ease: motion.enter
        });
        gsap.from('.composer-shell', {
          y: 6,
          autoAlpha: 0,
          duration: motion.base,
          delay: 0.12,
          ease: motion.enter
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.chat-welcome-title, .chat-welcome-support, .prompt-chip, .composer-shell', {
          autoAlpha: 0,
          duration: motion.fast
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [isInitialState] }
  );

  // New messages — bubble rise (DESIGN §6)
  useGSAP(
    () => {
      if (messages.length <= prevMsgCount.current) {
        prevMsgCount.current = messages.length;
        return;
      }
      prevMsgCount.current = messages.length;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.chat-msg:last-of-type', {
          y: RISE_Y,
          autoAlpha: 0,
          duration: motion.base,
          ease: motion.enter
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.chat-msg:last-of-type', { autoAlpha: 0, duration: motion.fast });
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [messages.length] }
  );

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
      textareaRef.current.style.height = '40px';
    }
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleToggleVoice = () => {
    setVoiceError(null);

    if (isVoiceListening) {
      stopSpeechRecognition(recognitionRef.current);
      recognitionRef.current = null;
      setIsVoiceListening(false);
      return;
    }

    if (isLoading) return;

    // Must run from click (Safari / iOS user-gesture + mic permission)
    stopSpeechRecognition(recognitionRef.current);
    const recognition = startSpeechRecognition({
      onListening: () => {
        setIsVoiceListening(true);
        setVoiceError(null);
      },
      onTranscript: (text) => setInputText(text),
      onError: (message) => {
        setIsVoiceListening(false);
        setVoiceError(message);
      },
      onEnd: () => {
        setIsVoiceListening(false);
        recognitionRef.current = null;
        textareaRef.current?.focus();
      }
    });
    recognitionRef.current = recognition;
  };

  const statusLine = isVoiceListening
    ? VOICE_COPY.listening
    : isTtsSpeaking
    ? VOICE_COPY.speaking
    : isLoading
    ? 'Structuring plan…'
    : 'Turn intentions into action';

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
      {/* Calm Header with Pipeline Cue */}
      <div
        className="panel-pad"
        style={{
          paddingTop: '14px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backgroundColor: 'var(--color-bg-surface)',
          minHeight: '52px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 'var(--font-size-label)', fontWeight: 600, color: 'var(--color-text-primary)', flexShrink: 0 }}>
            Assistant
          </span>
          <span style={{ color: 'var(--color-border-strong)', flexShrink: 0 }}>·</span>
          <p
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-tertiary)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {statusLine}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {ttsSupported && (
            <button
              type="button"
              className="composer-icon-btn"
              onClick={handleToggleVoiceOut}
              aria-pressed={voiceOutOn}
              aria-label={
                isTtsSpeaking
                  ? VOICE_COPY.stopSpeaking
                  : voiceOutOn
                  ? VOICE_COPY.voiceOn
                  : VOICE_COPY.voiceOff
              }
              title={
                isTtsSpeaking
                  ? VOICE_COPY.stopSpeaking
                  : voiceOutOn
                  ? VOICE_COPY.voiceOn
                  : VOICE_COPY.voiceOff
              }
              style={{
                width: '36px',
                height: '36px',
                color: voiceOutOn ? 'var(--color-action-primary)' : 'var(--color-text-tertiary)'
              }}
            >
              {voiceOutOn ? <Volume2 size={16} strokeWidth={1.75} /> : <VolumeX size={16} strokeWidth={1.75} />}
            </button>
          )}
          <PipelineTrace
            stage={pipeline.stage}
            toolName={pipeline.toolName}
            isCollapsed={pipeline.isCollapsed}
          />
        </div>
      </div>

      {judgeScenarios.length > 0 && onJudgeScenario && !isInitialState && (
        <div className="judge-scenarios judge-scenarios--compact panel-pad" aria-label="Judge demo scenarios">
          <div className="judge-scenarios__row">
            {judgeScenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                className="judge-scenario-pill"
                disabled={isLoading}
                title={s.hint}
                onClick={() => onJudgeScenario(s)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversation thread"
        className="panel-pad"
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingTop: '20px',
          paddingBottom: '20px',
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
              className="chat-welcome-title"
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
              className="chat-welcome-support"
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                lineHeight: '22px',
                margin: '0 0 16px 0',
                maxWidth: '100%'
              }}
            >
              Tell me the goal and how much time you have. I&apos;ll build the plan.
            </p>

            {judgeScenarios.length > 0 && onJudgeScenario && (
              <div className="judge-scenarios" aria-label="Judge demo scenarios">
                <span className="judge-scenarios__label">60s demo</span>
                <div className="judge-scenarios__row">
                  {judgeScenarios.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="judge-scenario-pill"
                      disabled={isLoading}
                      title={s.hint}
                      onClick={() => onJudgeScenario(s)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prominent Stacked PromptChips (44px high each, full-width) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="prompt-chip chat-prompt-row"
                  style={{
                    minHeight: '44px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-default)',
                    backgroundColor: 'var(--color-bg-sunken)',
                    color: 'var(--color-text-primary)',
                    fontSize: '13px',
                    lineHeight: '1.45',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all var(--duration-fast) var(--ease-standard)'
                  }}
                >
                  <span style={{ fontWeight: 500, flex: 1 }}>{prompt}</span>
                  <ArrowRight
                    size={14}
                    color="var(--color-action-primary)"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
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
              className="chat-msg"
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

                        {msg.action.state === 'failed' && onApplyAction && (
                          <button
                            type="button"
                            onClick={() => onApplyAction(msg.action!)}
                            style={{
                              alignSelf: 'flex-start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginTop: '4px',
                              padding: '6px 14px',
                              backgroundColor: 'var(--color-bg-surface)',
                              color: 'var(--color-text-primary)',
                              border: '1px solid var(--color-border-default)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--font-size-label)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              minHeight: '36px'
                            }}
                          >
                            <RotateCcw size={12} /> Retry
                          </button>
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
            role="alert"
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-state-failed-bg)',
              border: '1px solid var(--color-state-failed-border)',
              color: 'var(--color-state-failed-text)',
              fontSize: 'var(--font-size-body)',
              lineHeight: '1.45',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ flex: 1 }}>{error}</span>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              {errorRetryable && onRetryError && (
                <button
                  type="button"
                  onClick={onRetryError}
                  aria-label="Retry"
                  style={{
                    border: '1px solid var(--color-state-failed-border)',
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-state-failed-text)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-label)',
                    fontWeight: 600,
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCcw size={12} /> Retry
                </button>
              )}
              {onDismissError && (
                <button
                  type="button"
                  onClick={onDismissError}
                  aria-label="Dismiss error"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-state-failed-text)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-label)',
                    fontWeight: 600,
                    padding: '2px 4px',
                    minHeight: '44px',
                    minWidth: '44px'
                  }}
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Follow-up Chips for Active Conversation */}
      {!isInitialState && suggestedPrompts.length > 0 && (
        <div
          className="panel-pad composer-followups"
          style={{
            paddingTop: '8px',
            paddingBottom: '8px',
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

      {/* Unified composer — one surface: mic (if supported) | field | send */}
      <form
        onSubmit={handleSubmit}
        className="panel-pad composer-bar"
        style={{
          paddingTop: '10px',
          borderTop: '1px solid var(--color-border-default)',
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        {voiceError && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: '8px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-state-failed-bg)',
              border: '1px solid var(--color-state-failed-border)',
              color: 'var(--color-state-failed-text)',
              fontSize: 'var(--font-size-body)',
              lineHeight: 1.4
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ flex: 1 }}>{voiceError}</span>
            {sttSupported && (
              <button
                type="button"
                onClick={handleToggleVoice}
                style={{
                  border: '1px solid var(--color-state-failed-border)',
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-state-failed-text)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-label)',
                  cursor: 'pointer',
                  minHeight: '36px'
                }}
              >
                Retry mic
              </button>
            )}
            <button
              type="button"
              onClick={() => setVoiceError(null)}
              aria-label="Dismiss"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--color-state-failed-text)',
                fontWeight: 600,
                fontSize: 'var(--font-size-label)',
                cursor: 'pointer',
                minHeight: '36px',
                minWidth: '36px'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        <div className={`composer-shell${isVoiceListening ? ' is-listening' : ''}`}>
          {sttSupported && (
            <button
              type="button"
              className="composer-icon-btn"
              onClick={handleToggleVoice}
              disabled={isLoading}
              title={
                isLoading
                  ? VOICE_COPY.voiceUnavailableWhileSending
                  : isVoiceListening
                  ? 'Stop listening'
                  : 'Voice input'
              }
              aria-label={isVoiceListening ? 'Stop listening' : 'Voice input'}
              aria-pressed={isVoiceListening}
            >
              <Mic size={18} strokeWidth={1.75} />
            </button>
          )}

          <textarea
            ref={textareaRef}
            data-composer
            className="composer-input"
            aria-label="Message Daybridge"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={sttSupported ? 'Say it or type it...' : 'Type your request...'}
            disabled={isLoading}
            rows={1}
            title="Press / to focus · Shift+Enter for newline"
          />

          <button
            type="submit"
            className={`composer-icon-btn composer-send${inputText.trim() && !isLoading ? ' is-ready' : ''}`}
            disabled={!inputText.trim() || isLoading}
            title="Send request"
            aria-label="Send request"
          >
            <ArrowUp size={18} strokeWidth={1.75} />
          </button>
        </div>
      </form>
    </div>
  );
};
