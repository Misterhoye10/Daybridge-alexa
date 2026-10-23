import { useEffect, useRef, useState } from 'react';
import type { PipelineStage } from '../components/common/PipelineTrace';

const MIN_STAGE_MS = 350;

/**
 * Drive Heard → Understood → Planning → Ready per API_CONTRACT (≥350ms/stage).
 */
export function usePipelinePlayback(opts: {
  isListening: boolean;
  isLoading: boolean;
  hasError: boolean;
  toolName?: string;
}): { stage: PipelineStage; toolName?: string; isCollapsed: boolean } {
  const { isListening, isLoading, hasError, toolName } = opts;
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [collapsed, setCollapsed] = useState(false);
  const timers = useRef<number[]>([]);
  const wasLoading = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();

    if (isListening) {
      wasLoading.current = false;
      setCollapsed(false);
      setStage('heard');
      return () => clearTimers();
    }

    if (hasError && !isLoading) {
      wasLoading.current = false;
      setCollapsed(false);
      setStage('failed');
      timers.current.push(window.setTimeout(() => setStage('idle'), 2400));
      return () => clearTimers();
    }

    if (isLoading) {
      wasLoading.current = true;
      setCollapsed(false);
      setStage('understood');
      timers.current.push(window.setTimeout(() => setStage('planning'), MIN_STAGE_MS));
      return () => clearTimers();
    }

    if (wasLoading.current) {
      wasLoading.current = false;
      setCollapsed(false);
      setStage('ready');
      timers.current.push(
        window.setTimeout(() => {
          setCollapsed(true);
          timers.current.push(
            window.setTimeout(() => {
              setStage('idle');
              setCollapsed(false);
            }, 1600)
          );
        }, MIN_STAGE_MS)
      );
      return () => clearTimers();
    }

    return () => clearTimers();
  }, [isListening, isLoading, hasError]);

  const displayStage = isListening ? 'heard' : stage;

  return {
    stage: displayStage,
    toolName:
      isLoading || displayStage === 'planning' || displayStage === 'understood'
        ? toolName
        : undefined,
    isCollapsed: collapsed && displayStage === 'ready'
  };
}
