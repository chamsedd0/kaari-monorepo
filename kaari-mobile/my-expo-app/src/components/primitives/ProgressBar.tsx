import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '~/theme/colors';

export type ProgressBarProps = {
  progress: number; // 0..1
  height?: number;
  background?: keyof typeof colors;
  foreground?: keyof typeof colors;
  rounded?: boolean;
};

export default function ProgressBar({
  progress,
  height = 4,
  background = 'gray100',
  foreground = 'primary',
  rounded = true,
}: ProgressBarProps) {
  const barStyle = useAnimatedStyle(() => ({ width: withTiming(`${Math.max(0, Math.min(1, progress)) * 100}%`, { duration: 240 }) }));
  return (
    <View style={{ backgroundColor: colors[background], height, borderRadius: rounded ? height / 2 : 0, overflow: 'hidden' }}>
      <Animated.View style={[{ backgroundColor: colors[foreground], height: '100%' }, barStyle]} />
    </View>
  );
}


