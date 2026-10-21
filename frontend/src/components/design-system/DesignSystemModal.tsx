import React, { useState } from 'react';
import { Logo } from '../brand/Logo';
import { AlexaOrb } from '../brand/AlexaOrb';
import type { OrbState } from '../brand/AlexaOrb';
import { ActionBadge } from '../common/ActionBadge';
import { ProgressBar } from '../plan/ProgressBar';
import { GranularityControl } from '../plan/GranularityControl';
import { X, Palette, Type, Layers, Activity } from 'lucide-react';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'typography' | 'states' | 'components'>('tokens');
  const [orbDemoState, setOrbDemoState] = useState<OrbState>('listening');
  const [granularityDemo, setGranularityDemo] = useState(2);

  if (!isOpen) return null;

  const colorTokens = [
    { name: 'Obsidian Canvas', css: '--bg-canvas', hex: '#0B0F1A', role: 'Main app background' },
    { name: 'Elevated Surface', css: '--bg-surface', hex: '#121826', role: 'Card / Panel container' },
    { name: 'Card Background', css: '--bg-card', hex: '#182236', role: 'Interactive items' },
    { name: 'Electric Teal', css: '--brand-teal', hex: '#00D4AA', role: 'Primary brand & execution' },
    { name: 'Electric Cyan', css: '--brand-cyan', hex: '#0EA5E9', role: 'Alexa ambient lighting' },
    { name: 'Warm Amber', css: '--accent-peach', hex: '#FDBA74', role: 'Suggested actions' },
    { name: 'Lavender Pulse', css: '--accent-lavender', hex: '#D8B4FE', role: 'Awaiting confirmation' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.05) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Logo size="md" />
            <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                Daybridge Design System
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Tokens, states, and UI primitives (Apple / Stripe tier)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 28px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          {[
            { id: 'tokens', label: 'Color Tokens', icon: Palette },
            { id: 'typography', label: 'Typography', icon: Type },
            { id: 'states', label: 'Action States (PRD 5.5)', icon: Activity },
            { id: 'components', label: 'Component Primitives', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 16px',
                  border: 'none',
                  borderBottom: `2px solid ${isActive ? 'var(--brand-teal)' : 'transparent'}`,
                  backgroundColor: 'transparent',
                  color: isActive ? '#FFF' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} color={isActive ? 'var(--brand-teal)' : 'inherit'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {activeTab === 'tokens' && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#FFF' }}>
                Semantic Color Tokens
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                {colorTokens.map((t) => (
                  <div
                    key={t.name}
                    style={{
                      padding: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div
                      style={{
                        height: '42px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: t.hex,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        marginBottom: '8px'
                      }}
                    />
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#FFF' }}>{t.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--brand-teal)' }}>
                      {t.hex} ({t.css})
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {t.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Display & Headlines</span>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', letterSpacing: '-0.02em', marginTop: '4px' }}>
                  Say it. Plan it. Get it done.
                </h1>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Plus Jakarta Sans Bold (800) / Tracking -0.02em
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Section Header</span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFF', marginTop: '4px' }}>
                  Software Engineering Interview Prep Sprint
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Plus Jakarta Sans Semi-Bold (700)
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Body Text</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '4px' }}>
                  Daybridge translates natural conversational intentions into structured, live-executable multi-day task plans with real-time state persistence.
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Monospace / Metadata</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--brand-teal)', marginTop: '4px' }}>
                  MONDAY (60m) · HIGH PRIORITY · STATUS: EXECUTED_AND_SAVED
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  JetBrains Mono Medium (500)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'states' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Per PRD Section 5.5, Daybridge strictly distinguishes between suggested actions, confirmation requirements, and successfully executed actions:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--state-suggested-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <ActionBadge state="suggested" />
                    <span style={{ fontSize: '0.8rem', color: '#FED7AA' }}>AI proposes a task addition or schedule adjustment</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Visualized with a warm amber outline and glowing chip. Never automatically overwrites the plan without review.
                  </p>
                </div>

                <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--state-awaiting-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <ActionBadge state="awaiting_confirmation" />
                    <span style={{ fontSize: '0.8rem', color: '#E9D5FF' }}>Destructive or major modification</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Visualized with soft lavender. Used before deleting plans or completely restructuring existing progress.
                  </p>
                </div>

                <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--state-completed-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <ActionBadge state="completed" />
                    <span style={{ fontSize: '0.8rem', color: '#5EEAD4' }}>Action Executed & Persisted</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Solid teal checkmark and active state synchronization with backend/session storage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Alexa Orb Interactive Demo */}
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF', marginBottom: '10px' }}>
                  Alexa+ Ambient Ring & Halo (Interactive States)
                </h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                  <AlexaOrb state={orbDemoState} size="lg" />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['idle', 'listening', 'thinking', 'speaking'] as OrbState[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => setOrbDemoState(st)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: orbDemoState === st ? '1px solid var(--brand-teal)' : '1px solid var(--border-subtle)',
                          backgroundColor: orbDemoState === st ? 'rgba(0, 212, 170, 0.15)' : 'transparent',
                          color: orbDemoState === st ? 'var(--brand-teal)' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Granularity Slider */}
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF', marginBottom: '10px' }}>
                  Granularity / Detail Level Control (Goblin-inspired)
                </h5>
                <div style={{ maxWidth: '340px' }}>
                  <GranularityControl value={granularityDemo} onChange={setGranularityDemo} />
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF', marginBottom: '10px' }}>
                  Progress Bar with Teal Glow
                </h5>
                <div style={{ maxWidth: '420px', padding: '14px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                  <ProgressBar completed={3} total={5} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
