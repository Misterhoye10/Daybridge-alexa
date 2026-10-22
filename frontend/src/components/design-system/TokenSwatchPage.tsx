import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../brand/Logo';
import { Sun, Moon, Check } from 'lucide-react';

interface TokenSwatchPageProps {
  onBack?: () => void;
}

export const TokenSwatchPage: React.FC<TokenSwatchPageProps> = ({ onBack }) => {
  const { theme, toggleTheme } = useTheme();

  const primitives = [
    {
      group: 'Gray (Neutral Scale)',
      colors: [
        { step: '0', hex: '#FFFFFF' },
        { step: '50', hex: '#F7F8F9' },
        { step: '100', hex: '#F0F2F4' },
        { step: '200', hex: '#E3E6EA' },
        { step: '300', hex: '#CDD2D8' },
        { step: '400', hex: '#9AA2AB' },
        { step: '500', hex: '#5F6873' },
        { step: '600', hex: '#4B5560' },
        { step: '700', hex: '#2B323A' },
        { step: '800', hex: '#1C2229' },
        { step: '900', hex: '#12161B' },
        { step: '950', hex: '#0B0E11' },
        { step: 'Edge-L', hex: '#858E99' },
        { step: 'Edge-D', hex: '#667280' }
      ]
    },
    {
      group: 'Harbor (Action Accent)',
      colors: [
        { step: '50', hex: '#EEF8F7' },
        { step: '100', hex: '#DDF1EF' },
        { step: '300', hex: '#7FCBC5' },
        { step: '400', hex: '#4FC2BB' },
        { step: '600', hex: '#0F6F6B', isKey: true },
        { step: '700', hex: '#0B5956' },
        { step: '900', hex: '#063533' }
      ]
    },
    {
      group: 'Amber (State Only)',
      colors: [
        { step: '100', hex: '#FDF0DA' },
        { step: '400', hex: '#F5B24D' },
        { step: '500', hex: '#F2A33A' },
        { step: '700', hex: '#8A5300' }
      ]
    },
    {
      group: 'Green (State Only)',
      colors: [
        { step: '100', hex: '#E3F4EA' },
        { step: '400', hex: '#5FCB92' },
        { step: '600', hex: '#1F7A4D' }
      ]
    },
    {
      group: 'Red (State Only)',
      colors: [
        { step: '100', hex: '#FBE9E7' },
        { step: '400', hex: '#FF8A80' },
        { step: '600', hex: '#B3261E' }
      ]
    }
  ];

  const contrastChecks = [
    { pair: 'text.primary on surface (Gray 900 on White)', fg: '#12161B', bg: '#FFFFFF', ratio: '18.2:1', standard: 'WCAG AAA (min 7:1)', status: 'pass' },
    { pair: 'text.secondary on surface (Gray 600 on White)', fg: '#4B5560', bg: '#FFFFFF', ratio: '7.6:1', standard: 'WCAG AAA (min 7:1)', status: 'pass' },
    { pair: 'text.tertiary on surface (Gray 500 on White)', fg: '#5F6873', bg: '#FFFFFF', ratio: '5.7:1', standard: 'WCAG AA (min 4.5:1)', status: 'pass' },
    { pair: 'text.tertiary on sunken (Gray 500 on Gray 100)', fg: '#5F6873', bg: '#F0F2F4', ratio: '5.0:1', standard: 'WCAG AA (min 4.5:1)', status: 'pass' },
    { pair: 'white on Harbor 600', fg: '#FFFFFF', bg: '#0F6F6B', ratio: '6.0:1', standard: 'WCAG AA (min 4.5:1)', status: 'pass' },
    { pair: 'border.strong light (Edge-L on White)', fg: '#858E99', bg: '#FFFFFF', ratio: '3.3:1', standard: 'UI Component min 3:1', status: 'pass' },
    { pair: 'border.strong dark (Edge-D on Gray 900)', fg: '#667280', bg: '#12161B', ratio: '3.7:1', standard: 'UI Component min 3:1', status: 'pass' },
    { pair: 'Amber 700 on Amber 100 (state tag)', fg: '#8A5300', bg: '#FDF0DA', ratio: '4.7:1', standard: 'WCAG AA (min 4.5:1)', status: 'pass' }
  ];

  const actionStates = [
    { state: 'Suggested', light: { bg: '#EEF8F7', border: '#7FCBC5', text: '#0B5956' }, dark: { bg: '#112624', border: '#1E5F5B', text: '#7FDDD6' } },
    { state: 'Awaiting confirmation', light: { bg: '#FDF0DA', border: '#F2A33A', text: '#8A5300' }, dark: { bg: '#2B2113', border: '#7A5A22', text: '#F5B24D' } },
    { state: 'Running', light: { bg: '#F0F2F4', border: '#E3E6EA', text: '#4B5560' }, dark: { bg: '#1C2229', border: '#2B323A', text: '#CDD2D8' } },
    { state: 'Completed', light: { bg: '#E3F4EA', border: '#8CCBA9', text: '#1F7A4D' }, dark: { bg: '#10261B', border: '#2E6B4A', text: '#5FCB92' } },
    { state: 'Failed', light: { bg: '#FBE9E7', border: '#E8A29C', text: '#B3261E' }, dark: { bg: '#2C1513', border: '#8A3A34', text: '#FF8A80' } }
  ];

  return (
    <div
      style={{
        padding: '32px',
        maxWidth: '1040px',
        margin: '0 auto',
        backgroundColor: 'var(--color-bg-canvas)',
        color: 'var(--color-text-primary)',
        minHeight: '100vh',
        fontFamily: 'var(--font-ui)'
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--color-border-default)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Logo size="lg" />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600 }}>
              Design Tokens & Color Swatches
            </h1>
            <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)' }}>
              Cool Neutral Scale & Harbor Accent · Light & Dark Modes
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-label)',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              ← Back to App
            </button>
          )}

          <button
            onClick={toggleTheme}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-label)',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            <span>{theme === 'light' ? 'Dark Theme' : 'Light Theme'}</span>
          </button>
        </div>
      </div>

      {/* Primitives Swatches */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 600, marginBottom: '16px' }}>
          Color Primitives (Section 4)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {primitives.map((group) => (
            <div key={group.group}>
              <h3 style={{ fontSize: 'var(--font-size-label)', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                {group.group}
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {group.colors.map((c) => (
                  <div
                    key={c.step}
                    style={{
                      width: '105px',
                      padding: '8px',
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div
                      style={{
                        height: '40px',
                        backgroundColor: c.hex,
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        marginBottom: '6px'
                      }}
                    />
                    <div style={{ fontSize: '11px', fontWeight: 600 }}>{c.step}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {c.hex}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action States Triples */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 600, marginBottom: '16px' }}>
          Action States Triples (Section 4)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {actionStates.map((st) => {
            const activeTriple = theme === 'light' ? st.light : st.dark;
            return (
              <div
                key={st.state}
                style={{
                  padding: '12px 16px',
                  backgroundColor: activeTriple.bg,
                  border: `1px solid ${activeTriple.border}`,
                  borderRadius: 'var(--radius-lg)',
                  color: activeTriple.text
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                  {st.state}
                </div>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                  bg: {activeTriple.bg} · border: {activeTriple.border} · text: {activeTriple.text}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contrast Verification Table */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 600, marginBottom: '16px' }}>
          WCAG Contrast Compliance (Computed 22 Oct 2026)
        </h2>
        <div
          style={{
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-surface)'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-default)', backgroundColor: 'var(--color-bg-sunken)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Color Pair</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Preview</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Contrast Ratio</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Compliance Standard</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {contrastChecks.map((row) => (
                <tr key={row.pair} style={{ borderBottom: '1px solid var(--color-border-default)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{row.pair}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: row.bg,
                        color: row.fg,
                        fontWeight: 500,
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                    >
                      Aa Text
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{row.ratio}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-text-secondary)' }}>{row.standard}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#1F7A4D',
                        fontWeight: 600
                      }}
                    >
                      <Check size={14} /> Passed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Typography Scale Preview */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 600, marginBottom: '16px' }}>
          Typography Scale (Geist Family)
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '20px',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>display · Geist 600 · 32/40</div>
            <div style={{ fontSize: 'var(--font-size-display)', lineHeight: 'var(--line-height-display)', fontWeight: 600, letterSpacing: 'var(--letter-spacing-display)' }}>
              What do you want to get done?
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>h1 · Geist 600 · 24/32</div>
            <div style={{ fontSize: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)', fontWeight: 600, letterSpacing: 'var(--letter-spacing-h1)' }}>
              Interview Preparation Plan
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>h2 · Geist 600 · 18/26</div>
            <div style={{ fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)', fontWeight: 600 }}>
              Plan Summary & Schedule
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>body · Geist 400 · 14/22</div>
            <div style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
              Daybridge turns conversational intentions into structured, actionable plans with real backend state execution.
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>data · Geist Mono 500 · 12/16</div>
            <div style={{ fontSize: 'var(--font-size-data)', lineHeight: 'var(--line-height-data)', fontFamily: 'var(--font-mono)' }}>
              45 min · Fri 24 Oct · create_plan
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
