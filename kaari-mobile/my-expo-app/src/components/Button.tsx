import React from 'react';
import { ActivityIndicator, Pressable, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolateColor } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';

type CommonButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

type IconButtonProps = CommonButtonProps & {
  icon?: React.ReactNode;
  forcePressed?: boolean; // for gallery/demo to render pressed visuals without interaction
  loading?: boolean;
};

export function PrimaryButton({ label, icon, onPress, disabled, style, testID, forcePressed, loading }: IconButtonProps) {
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = disabled
      ? colors.primaryDisabled
      : interpolateColor(
          forcePressed ? 1 : progress.value,
          [0, 1],
          [colors.primary, colors.primaryDark]
        );
    return { backgroundColor } as ViewStyle;
  }, [disabled, forcePressed]);

  return (
    <Pressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => {
        progress.value = withTiming(1, { duration: 150 });
      }}
      onPressOut={() => {
        progress.value = withTiming(0, { duration: 150 });
      }}
      style={style}
    >
      <Animated.View
        className="px-6 py-4 items-center justify-center flex-row gap-2 rounded-[100px]"
        style={[animatedStyle]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <VText style={{ color: colors.white }} className="text-[14px] leading-[14px]" weight="bold">{label}</VText>
            {icon ? <View className="ml-1">{icon}</View> : null}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function SecondaryButton({ label, icon, onPress, disabled, style, testID, forcePressed, loading }: IconButtonProps) {
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = disabled
      ? colors.secondaryDisabled
      : interpolateColor(
          forcePressed ? 1 : progress.value,
          [0, 1],
          [colors.white, colors.primaryTint1]
        );
    return { backgroundColor } as ViewStyle;
  }, [disabled, forcePressed]);

  return (
    <Pressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => {
        progress.value = withTiming(1, { duration: 150 });
      }}
      onPressOut={() => {
        progress.value = withTiming(0, { duration: 150 });
      }}
      style={style}
    >
      <Animated.View
        className="px-6 py-4 items-center justify-center flex-row gap-2 rounded-[100px] border"
        style={[animatedStyle, { borderColor: colors.primaryTint1 }]}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <VText style={{ color: colors.primary }} className="text-[14px] leading-[14px]" weight="bold">{label}</VText>
            {icon ? <View className="ml-1">{icon}</View> : null}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

type DualButtonProps = {
  leftLabel: string;
  rightLabel: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  disabled?: boolean;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
  leftLoading?: boolean;
  rightLoading?: boolean;
  testID?: string;
};

// Footer-like dual button group for cards. No icons by design.
export function CardDualButton({ leftLabel, rightLabel, onLeftPress, onRightPress, disabled, leftDisabled, rightDisabled, leftLoading, rightLoading, testID }: DualButtonProps) {
  const borderColor = colors.primaryTint1;
  const leftProgress = useSharedValue(0);
  const rightProgress = useSharedValue(0);
  const leftStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(leftProgress.value, [0, 1], [colors.white, colors.primaryTint1]);
    return { backgroundColor } as ViewStyle;
  });
  const rightStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(rightProgress.value, [0, 1], [colors.white, colors.primaryTint1]);
    return { backgroundColor } as ViewStyle;
  });

  return (
    <View
      testID={testID}
      className="flex-row overflow-hidden"
      style={{ borderColor, borderWidth: 1, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onLeftPress}
        disabled={disabled || leftDisabled || leftLoading}
        className="flex-1"
        onPressIn={() => {
          leftProgress.value = withTiming(1, { duration: 150 });
        }}
        onPressOut={() => {
          leftProgress.value = withTiming(0, { duration: 150 });
        }}
      >
        <Animated.View
          className="py-4 items-center justify-center"
          style={[leftStyle, { borderRightColor: borderColor, borderRightWidth: 1 }]}
        >
          {leftLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <VText style={{ color: colors.primary }} className="text-[14px] leading-[14px]" weight="bold">{leftLabel}</VText>
          )}
        </Animated.View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onRightPress}
        disabled={disabled || rightDisabled || rightLoading}
        className="flex-1"
        onPressIn={() => {
          rightProgress.value = withTiming(1, { duration: 150 });
        }}
        onPressOut={() => {
          rightProgress.value = withTiming(0, { duration: 150 });
        }}
      >
        <Animated.View className="py-4 items-center justify-center" style={[rightStyle]}> 
          {rightLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <VText style={{ color: colors.primary }} className="text-[14px] leading-[14px]" weight="bold">{rightLabel}</VText>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

export default {
  PrimaryButton,
  SecondaryButton,
  CardDualButton,
};


