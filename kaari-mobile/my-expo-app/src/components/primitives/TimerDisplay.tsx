import React from 'react';
import { View } from 'react-native';
import TimerBlock, { TimerBlockScheme, TimerBlockSize } from './TimerBlock';
import { useTimer, formatTimer, UseTimerOptions } from './useTimer';
import { colors } from '~/theme/colors';

function Dot() {
  return <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white, marginVertical: 2 }} />;
}

function Separator({ scheme, size }: { scheme: TimerBlockScheme; size: TimerBlockSize }) {
  const isPurple = scheme === 'purple';
  const color = isPurple ? colors.primary : colors.white;
  const dotSize = size === 'big' ? 6 : 4;
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: size === 'big' ? 8 : 6 }}>
      <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: color, marginBottom: 4 }} />
      <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: color }} />
    </View>
  );
}

export type TimerDisplayProps = {
  size: TimerBlockSize; // 'big' shows labels
  scheme: TimerBlockScheme; // white or purple row
  mode?: UseTimerOptions['mode'];
  initialSeconds: number;
  autoStart?: boolean;
};

export default function TimerDisplay({ size, scheme, mode = 'countdown', initialSeconds, autoStart = true }: TimerDisplayProps) {
  const { seconds } = useTimer({ mode, initialSeconds, autoStart });

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const dayCount = Math.floor(hrs / 24);
  const remHours = hrs % 24;

  const values = size === 'big'
    ? [String(dayCount), String(remHours).padStart(2, '0'), String(mins).padStart(2, '0'), String(secs).padStart(2, '0')]
    : [String(dayCount || 0), String(remHours).padStart(2, '0'), String(mins).padStart(2, '0'), String(secs).padStart(2, '0')];

  const labels = ['Days', 'Hours', 'Minutes', 'Seconds'];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {values.map((v, i) => (
        <React.Fragment key={i}>
          <TimerBlock value={v} size={size} scheme={scheme} label={size === 'big' ? labels[i] : undefined} />
          {i < values.length - 1 && <Separator scheme={scheme} size={size} />}
        </React.Fragment>
      ))}
    </View>
  );
}


