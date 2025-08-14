import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';

type SwitchProps = {
  value: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  testID?: string;
  style?: ViewStyle | ViewStyle[];
};

export function Switch({ value, onChange, disabled, testID, style }: SwitchProps) {
  const progress = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 180 });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(progress.value, [0, 1], [colors.primaryTint1, colors.success]),
      opacity: disabled ? 0.6 : 1,
    } as ViewStyle;
  });

  const knobStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [2, 22]); // 48 width - 20 knob - 2*2 padding
    return {
      transform: [{ translateX }],
    } as ViewStyle;
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      onPress={() => {
        if (disabled) return;
        onChange?.(!value);
      }}
      disabled={disabled}
      testID={testID}
      className="w-12 h-6 rounded-full"
      style={style}
    >
      <Animated.View className="w-full h-full rounded-full" style={trackStyle}>
        <Animated.View
          className="w-5 h-5 rounded-full bg-white mt-[2px]"
          style={[knobStyle]}
        />
      </Animated.View>
    </Pressable>
  );
}

export default { Switch };


