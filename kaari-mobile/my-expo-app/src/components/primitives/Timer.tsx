import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import { formatTimer, useTimer, UseTimerOptions } from './useTimer';

export type TimerProps = {
  size?: 'small' | 'big';
  colorScheme?: 'white' | 'purple';
  rounded?: boolean;
  mode?: UseTimerOptions['mode'];
  initialSeconds?: number;
  autoStart?: boolean;
  showHours?: boolean;
  // Controlled override
  secondsOverride?: number;
  isRunning?: boolean;
  onTick?: (seconds: number) => void;
  onEnd?: () => void;
};

export default function Timer({
  size = 'small',
  colorScheme = 'purple',
  rounded = true,
  mode = 'countdown',
  initialSeconds = 0,
  autoStart = false,
  showHours = false,
  secondsOverride,
  isRunning,
  onTick,
  onEnd,
}: TimerProps) {
  const isBig = size === 'big';
  const isPurple = colorScheme === 'purple';
  const bg = isPurple ? 'primary' : 'white';
  const fg = isPurple ? 'white' : 'primary';

  const { seconds, start, stop, reset } = useTimer({ mode, initialSeconds, autoStart, isRunning, onTick, onEnd });
  const value = secondsOverride ?? seconds;
  const timeText = formatTimer(value, isBig || showHours);

  return (
    <View className={`${rounded ? 'rounded-[100px]' : 'rounded-[6px]'} ${isPurple ? '' : 'border'} px-[${isBig ? 20 : 12}px] py-[${isBig ? 10 : 4}px]`} style={{ backgroundColor: colors[bg], borderColor: isPurple ? 'transparent' : colors.primary }}>
      <Text style={{ color: colors[fg], fontSize: isBig ? 24 : 12, fontWeight: '800', letterSpacing: isBig ? 1 : 0.5, fontVariant: ['tabular-nums'] }}>{timeText}</Text>
    </View>
  );
}


