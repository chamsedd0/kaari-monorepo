import React from 'react';

export type TimerMode = 'countdown' | 'countup';

export type UseTimerOptions = {
  mode: TimerMode;
  initialSeconds: number; // for countdown: starting value; for countup: starting elapsed
  autoStart?: boolean;
  isRunning?: boolean; // if provided, controlled; otherwise internal state
  onTick?: (seconds: number) => void;
  onEnd?: () => void; // only for countdown when reaches 0
};

export function useTimer({ mode, initialSeconds, autoStart = true, isRunning, onTick, onEnd }: UseTimerOptions) {
  const [seconds, setSeconds] = React.useState(initialSeconds);
  const [internalRunning, setInternalRunning] = React.useState(autoStart);

  const running = isRunning ?? internalRunning;

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((prev) => {
        const next = mode === 'countdown' ? Math.max(0, prev - 1) : prev + 1;
        onTick?.(next);
        if (mode === 'countdown' && next === 0) {
          // stop and notify
          clearInterval(id);
          setInternalRunning(false);
          onEnd?.();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const start = React.useCallback(() => setInternalRunning(true), []);
  const stop = React.useCallback(() => setInternalRunning(false), []);
  const reset = React.useCallback((value: number = initialSeconds) => setSeconds(value), [initialSeconds]);

  return { seconds, running, start, stop, reset, setSeconds } as const;
}

export function formatTimer(seconds: number, showHours: boolean) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  if (showHours || hrs > 0) {
    const hh = String(hrs).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}


