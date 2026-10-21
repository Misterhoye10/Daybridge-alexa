import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showWordmark = true,
  className = '' 
}) => {
  const dimensions = {
    sm: { icon: 24, fontSize: '1rem', gap: '8px' },
    md: { icon: 32, fontSize: '1.35rem', gap: '10px' },
    lg: { icon: 44, fontSize: '1.8rem', gap: '14px' }
  }[size];

  return (
    <div 
      className={`daybridge-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dimensions.gap,
        userSelect: 'none'
      }}
    >
      {/* Precision Dual-Arch SVG Mark */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 0 12px rgba(14, 165, 233, 0.45))' }}
      >
        <defs>
          <linearGradient id="dbOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4AA" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="dbInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        {/* Outer Bridge Arch */}
        <path
          d="M 12 76 C 16 36, 42 22, 50 22 C 58 22, 84 36, 88 76"
          stroke="url(#dbOuterGrad)"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Inner Bridge Arch */}
        <path
          d="M 28 76 C 33 50, 44 42, 50 42 C 56 42, 67 50, 72 76"
          stroke="url(#dbInnerGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <span
          style={{
            fontFamily: "var(--font-family, 'Plus Jakarta Sans', sans-serif)",
            fontWeight: 700,
            fontSize: dimensions.fontSize,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            lineHeight: 1
          }}
        >
          day<span style={{ color: 'var(--brand-teal, #00D4AA)' }}>bridge</span>
        </span>
      )}
    </div>
  );
};
