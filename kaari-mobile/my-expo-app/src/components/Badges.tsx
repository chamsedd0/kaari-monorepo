import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { VText } from './typography';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import CloseIcon from '../../assets/Icon_Cross.svg';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function usePressScale() {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const onIn = () => (scale.value = withTiming(0.97, { duration: 80 }));
  const onOut = () => (scale.value = withTiming(1, { duration: 120 }));
  return { style, onIn, onOut };
}

type FilterBadgeProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onClear?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function FilterBadge({ label, selected, onPress, onClear, style, testID }: FilterBadgeProps) {
  const { style: anim, onIn, onOut } = usePressScale();
  const bg = colors.gray500; // #727272, always
  const textColor = colors.white;
  return (
    <AnimatedPressable
      testID={testID}
      className="flex-row items-center rounded-[100px] px-3 py-2 self-start"
      onPressIn={onIn}
      onPressOut={onOut}
      onPress={onPress}
      style={[{ backgroundColor: bg }, anim, style as any]}
    >
      <Text className="text-[14px] leading-[14px]" style={{ color: textColor }}>
        {label}
      </Text>
      {selected ? (
        <Pressable accessibilityRole="button" className="ml-2" onPress={onClear} hitSlop={8}>
          <CloseIcon width={14} height={14} color={colors.white} stroke={colors.white} />
        </Pressable>
      ) : null}
    </AnimatedPressable>
  );
}

type StatusVariant = 'info' | 'success' | 'danger' | 'primary';

type StatusBadgeProps = {
  label: string;
  variant: StatusVariant;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function StatusBadge({ label, variant, style, testID }: StatusBadgeProps) {
  const bg = variant === 'info' ? colors.info : variant === 'success' ? colors.success : variant === 'danger' ? colors.danger : colors.primary;
  const displayLabel = (label ?? '').trim().split(/\s+/)[0];
  return (
    <View
      testID={testID}
      className="rounded-[100px] w-[80px] h-[27px] items-center justify-center"
      style={[{ backgroundColor: bg }, style as any]}
    >
      <VText className="text-white text-[12px] leading-[12px]" weight="semibold">{displayLabel}</VText>
    </View>
  );
}

export default { FilterBadge, StatusBadge };

// Section badge shown on card corners: two rounded corners only
type SectionBadgeVariant = 'purple' | 'white' | 'gold';

export function SectionBadge({
  label,
  variant = 'purple',
  style,
  testID,
}: {
  label: string;
  variant?: SectionBadgeVariant;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}) {
  const bg = variant === 'purple' ? colors.primary : variant === 'gold' ? colors.warning : colors.white;
  const fg = variant === 'white' ? colors.primary : colors.white;
  return (
    <View
      testID={testID}
      className="px-[12px] py-[13px] rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none"
      style={[{ backgroundColor: bg }, style as any]}
    >
      <VText className="text-[14px] leading-[14px]" weight="bold" style={{ color: fg }}>
        {label}
      </VText>
    </View>
  );
}



