import React from 'react';
import { View, PanResponder } from 'react-native';
import { colors } from '~/theme/colors';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export type SliderProps = {
  value: number; // 0..1
  onChange?: (v: number) => void;
  trackColor?: keyof typeof colors;
  thumbColor?: keyof typeof colors;
};

export default function Slider({ value, onChange, trackColor = 'gray100', thumbColor = 'primary' }: SliderProps) {
  const width = 220;
  const thumbX = useSharedValue(value * width);

  React.useEffect(() => {
    thumbX.value = withSpring(Math.max(0, Math.min(1, value)) * width, { damping: 18, stiffness: 160 });
  }, [value]);

  const pan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const x = Math.max(0, Math.min(width, g.dx + thumbX.value));
        onChange?.(x / width);
      },
    }),
  ).current;

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: thumbX.value }] }));

  return (
    <View style={{ width, height: 28, justifyContent: 'center' }}>
      <View style={{ height: 6, backgroundColor: colors[trackColor], borderRadius: 100 }} />
      <Animated.View
        {...pan.panHandlers}
        style={[
          {
            position: 'absolute',
            top: 0,
            left: -14,
            width: 28,
            height: 28,
            borderRadius: 100,
            backgroundColor: colors[thumbColor],
          },
          thumbStyle,
        ]}
      />
    </View>
  );
}


