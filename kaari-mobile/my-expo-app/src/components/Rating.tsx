import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import StarIcon from '../../assets/Icon_Star.svg';
import { colors } from '../theme/colors';

type RatingProps = {
  value: number;
  onChange?: (next: number) => void;
  max?: number;
  size?: number;
  spacing?: number;
  disabled?: boolean;
  readOnly?: boolean;
  testID?: string;
  style?: ViewStyle | ViewStyle[];
};

type StarProps = {
  active: boolean;
  size: number;
  onPress?: () => void;
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Star({ active, size, onPress, disabled }: StarProps) {
  const colorProgress = useSharedValue(active ? 1 : 0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    colorProgress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    } as ViewStyle;
  });


  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={() => {
        if (disabled) return;
        scale.value = withTiming(0.92, { duration: 80 });
      }}
      onPressOut={() => {
        if (disabled) return;
        scale.value = withTiming(1, { duration: 120 });
      }}
      onPress={onPress}
      className="items-center justify-center"
      style={animatedStyle}
    >
      <View style={{ width: size, height: size }} className="relative">
        <View className="absolute inset-0">
          <StarIcon width={size} height={size} color={colors.gray300} />
        </View>
        <Animated.View className="absolute inset-0" style={{ opacity: colorProgress }}>
          <StarIcon width={size} height={size} color={colors.warning} />
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

export function Rating({ value, onChange, max = 5, size = 22, spacing = 10, disabled, readOnly, testID, style }: RatingProps) {
  const clamped = Math.max(0, Math.min(max, Math.round(value)));
  const stars = Array.from({ length: max });
  return (
    <View testID={testID} className="flex-row items-center" style={[{ columnGap: spacing }, style as any]}>
      {stars.map((_, idx) => {
        const isActive = idx < clamped;
        return (
          <Star
            key={idx}
            active={isActive}
            size={size}
            disabled={disabled || readOnly}
            onPress={readOnly ? undefined : () => onChange?.(idx + 1)}
          />
        );
      })}
    </View>
  );
}

export default { Rating };


