import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { gsap, useGSAP } from '../../motion/setup';
import { motion, RISE_Y } from '../../motion/tokens';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  durationMs?: number;
}

/** Low-risk success only — never errors (#20). DESIGN: 4s. */
export const Toast: React.FC<ToastProps> = ({ message, onDismiss, durationMs = 4000 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!message || !ref.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          ref.current,
          { y: RISE_Y, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: motion.base, ease: motion.enter }
        );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: motion.fast });
      });
      return () => mm.revert();
    },
    { dependencies: [message] }
  );

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(t);
  }, [message, durationMs, onDismiss]);

  if (!message) return null;

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className="daybridge-toast"
      style={{
        position: 'fixed',
        bottom: 'max(24px, env(safe-area-inset-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: 'var(--color-bg-raised)',
        border: '1px solid var(--color-border-default)',
        boxShadow: 'var(--elevation-e2)',
        color: 'var(--color-text-primary)',
        fontSize: 'var(--font-size-body)',
        fontWeight: 500,
        maxWidth: 'min(420px, calc(100vw - 32px))'
      }}
    >
      <Check size={14} color="var(--color-state-completed-text)" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};
