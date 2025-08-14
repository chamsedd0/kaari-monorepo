import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import CameraIcon from '../../assets/Icon_Photoshoot.svg';
import PlusIcon from '../../assets/Icon_Add.svg';

export type BookPhotoshootCTAProps = {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BookPhotoshootCTA({ label = 'Book a Photoshoot!', onPress, disabled, style, testID }: BookPhotoshootCTAProps) {
  const p = useSharedValue(0);
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.primary, colors.primaryDark]),
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => (p.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (p.value = withTiming(0, { duration: 160 }))}
      className="rounded-2xl overflow-hidden"
      style={[bgStyle, { paddingVertical: 14, paddingHorizontal: 16 }, style as any]}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <CameraIcon width={32} height={32} color={colors.white} />
          <VText className="ml-3 text-[16px] leading-[16px]" weight="bold" style={{ color: colors.white }}>{label}</VText>
        </View>
        <View className="w-[32px] h-[32px] items-center justify-center rounded-full border" style={{ borderColor: colors.white }}>
          <PlusIcon width={20} height={20} color={colors.white} />
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default { BookPhotoshootCTA };


