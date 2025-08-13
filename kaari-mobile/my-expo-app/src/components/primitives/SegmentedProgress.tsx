import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '~/theme/colors';

export type SegmentedProgressProps = {
  segments: number; // e.g., 4 stories
  activeIndex: number; // 0-based index
  progressInActive: number; // 0..1 progress within active segment
  gap?: number;
  height?: number;
  passiveColor?: keyof typeof colors;
  activeColor?: keyof typeof colors;
};

export default function SegmentedProgress({
  segments,
  activeIndex,
  progressInActive,
  gap = 4,
  height = 3,
  passiveColor = 'gray300',
  activeColor = 'white',
}: SegmentedProgressProps) {
  return (
    <View className="flex-row" style={{ columnGap: gap }}>
      {Array.from({ length: segments }).map((_, i) => (
        <Segment key={i} isActive={i === activeIndex} isPast={i < activeIndex} progress={i === activeIndex ? progressInActive : i < activeIndex ? 1 : 0} height={height} passiveColor={passiveColor} activeColor={activeColor} />
      ))}
    </View>
  );
}

function Segment({ isActive, isPast, progress, height, passiveColor, activeColor }: { isActive: boolean; isPast: boolean; progress: number; height: number; passiveColor: keyof typeof colors; activeColor: keyof typeof colors }) {
  const widthStyle = useAnimatedStyle(() => ({ width: withTiming(`${Math.max(0, Math.min(1, progress)) * 100}%`, { duration: isActive ? 160 : 0 }) }));
  return (
    <View className="overflow-hidden" style={{ flex: 1, height, borderRadius: height / 2, backgroundColor: isPast ? colors[activeColor] : colors[passiveColor] }}>
      <Animated.View style={[{ height: '100%', backgroundColor: colors[activeColor] }, widthStyle]} />
    </View>
  );
}


