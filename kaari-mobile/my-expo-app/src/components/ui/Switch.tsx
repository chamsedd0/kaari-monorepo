import { Pressable, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../../theme/colors';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
};

export function Switch({ value, onValueChange, disabled, width = 56, height = 32 }: Props) {
  const t = useSharedValue(value ? 1 : 0);

  // Sync when parent changes
  t.value = withTiming(value ? 1 : 0, { duration: 180 });

  const padding = 4;
  const thumbSize = height - padding * 2;
  const travel = width - padding * 2 - thumbSize;

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(t.value, [0, 1], [colors.primaryTint1, colors.success]),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(t.value * travel, { duration: 180 }) }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <Animated.View className="rounded-full" style={[{ width, height, padding }, trackStyle]}> 
        <Animated.View style={[{
          width: thumbSize,
          height: thumbSize,
          borderRadius: thumbSize / 2,
          backgroundColor: colors.white,
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.9)'
        }, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}


