import React from 'react';
import { Sparkles, Mic, Loader2, Volume2 } from 'lucide-react';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface AlexaOrbProps {
  state?: OrbState;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AlexaOrb: React.FC<AlexaOrbProps> = ({
  state = 'idle',
  size = 'md',
  interactive = false,
  onClick,
  className = ''
}) => {
  const sizeMap = {
    sm: { core: 28, glow: 10, icon: 13 },
    md: { core: 36, glow: 16, icon: 16 },
    lg: { core: 54, glow: 24, icon: 24 }
  }[size];

  const stateConfig = {
    idle: {
      gradient: 'linear-gradient(135deg, #00D4AA 0%, #0EA5E9 100%)',
      glow: '0 0 20px rgba(14, 165, 233, 0.35)',
      animation: 'none',
      icon: Sparkles
    },
    listening: {
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
      glow: '0 0 32px rgba(14, 165, 233, 0.7), 0 0 60px rgba(0, 212, 170, 0.4)',
      animation: 'pulse 1.4s infinite ease-in-out',
      icon: Mic
    },
    thinking: {
      gradient: 'linear-gradient(135deg, #D8B4FE 0%, #0EA5E9 100%)',
      glow: '0 0 35px rgba(216, 180, 254, 0.6), 0 0 65px rgba(14, 165, 233, 0.4)',
      animation: 'pulse 1.8s infinite ease-in-out',
      icon: Loader2
    },
    speaking: {
      gradient: 'linear-gradient(135deg, #00D4AA 0%, #34D399 100%)',
      glow: '0 0 35px rgba(0, 212, 170, 0.7), 0 0 60px rgba(52, 211, 153, 0.4)',
      animation: 'pulse 1.2s infinite ease-in-out',
      icon: Volume2
    }
  }[state];

  const Icon = stateConfig.icon;

  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={`alexa-orb-wrapper ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'pointer' : 'default',
        width: sizeMap.core,
        height: sizeMap.core
      }}
      title={`Alexa+ Co-pilot: ${state.toUpperCase()}`}
    >
      {/* Outer Glow Halo Ring */}
      <div
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          background: stateConfig.gradient,
          opacity: state === 'idle' ? 0.3 : 0.6,
          filter: `blur(${sizeMap.glow}px)`,
          transition: 'all var(--transition-normal)',
          animation: stateConfig.animation
        }}
      />

      {/* Core Orb */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: stateConfig.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: stateConfig.glow,
          position: 'relative',
          zIndex: 2,
          transition: 'all var(--transition-normal)'
        }}
      >
        <Icon
          size={sizeMap.icon}
          color="#0B0F1A"
          strokeWidth={2.5}
          style={{
            animation: state === 'thinking' ? 'spin 1.8s linear infinite' : 'none'
          }}
        />
      </div>
    </div>
  );
};
