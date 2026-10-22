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
  const pixelSizes = {
    sm: { icon: 20, fontSize: '15px', gap: '8px' },
    md: { icon: 28, fontSize: '19px', gap: '10px' },
    lg: { icon: 36, fontSize: '24px', gap: '12px' }
  }[size];

  return (
    <div
      className={`daybridge-logo-lockup ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: pixelSizes.gap,
        userSelect: 'none'
      }}
    >
      {/* Official 32x32 Bridge Arch & Harbor Dot SVG (Section 3) */}
      <svg
        width={pixelSizes.icon}
        height={pixelSizes.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        {/* Arch: Gray 900 in light, Gray 50 in dark via var(--color-text-primary) */}
        <path
          d="M6 27V16a10 10 0 0 1 20 0v11"
          stroke="var(--color-text-primary, #12161B)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dot: Harbor 600 in light (#0F6F6B), Harbor 400 in dark (#4FC2BB) via var(--color-action-primary) */}
        <circle
          cx="16"
          cy="21"
          r="3"
          fill="var(--color-action-primary, #0F6F6B)"
        />
      </svg>

      {showWordmark && (
        <span
          style={{
            fontFamily: "var(--font-ui, 'Geist', sans-serif)",
            fontWeight: 600,
            fontSize: pixelSizes.fontSize,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary, #12161B)',
            lineHeight: 1
          }}
        >
          daybridge
        </span>
      )}
    </div>
  );
};
