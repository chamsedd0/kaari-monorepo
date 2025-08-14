import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import VerifiedIcon from '../../assets/Icon_Verified.svg';
import PeopleIcon from '../../assets/Icon_People.svg';
import CheckIcon from '../../assets/Icon_Check.svg';
import CrossIcon from '../../assets/Icon_Cross.svg';

type PillVariant = 'purple' | 'white';

type VerifiedTagProps = {
  label?: string;
  variant?: PillVariant;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function usePressScale() {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const onIn = () => (scale.value = withTiming(0.96, { duration: 80 }));
  const onOut = () => (scale.value = withTiming(1, { duration: 120 }));
  return { style, onIn, onOut };
}

export function VerifiedTag({ label = 'Verified', variant = 'purple', onPress, style, testID }: VerifiedTagProps) {
  const isPurple = variant === 'purple';
  const { style: animated, onIn, onOut } = usePressScale();
  return (
    <AnimatedPressable
      testID={testID}
      className="flex-row items-center px-3 py-2 rounded-[100px]"
      style={[animated, style as any, { backgroundColor: isPurple ? colors.primary : colors.white }]}
      onPressIn={onIn}
      onPressOut={onOut}
      onPress={onPress}
    >
      <VerifiedIcon
        width={16}
        height={16}
        color={isPurple ? colors.white : colors.primary}
        fill={isPurple ? colors.white : colors.primary}
        stroke={isPurple ? colors.white : colors.primary}
        strokeWidth={1.5}
      />
      <Text
        className="ml-2 text-[14px] leading-[14px] font-medium"
        style={{ color: isPurple ? colors.white : colors.primary }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

type PeopleTagProps = {
  count: number;
  variant?: PillVariant;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function PeopleTag({ count, variant = 'purple', onPress, style, testID }: PeopleTagProps) {
  const isPurple = variant === 'purple';
  const { style: animated, onIn, onOut } = usePressScale();
  return (
    <AnimatedPressable
      testID={testID}
      className="flex-row items-center px-3 py-2 rounded-[100px]"
      style={[animated, style as any, { backgroundColor: isPurple ? colors.primary : colors.white }]}
      onPressIn={onIn}
      onPressOut={onOut}
      onPress={onPress}
    >
      <PeopleIcon
        width={16}
        height={16}
        color={isPurple ? colors.white : colors.primary}
        fill={isPurple ? colors.white : colors.primary}
        stroke={isPurple ? colors.white : colors.primary}
        strokeWidth={1.5}
      />
      <Text
        className="ml-2 text-[14px] leading-[14px] font-medium"
        style={{ color: isPurple ? colors.white : colors.primary }}
      >
        {count}
      </Text>
    </AnimatedPressable>
  );
}

type BadgeKind = 'check' | 'cross' | 'payment-status-fail' | 'payment-status-success';

type IconBadgeProps = {
  kind: BadgeKind;
  size?: number; // container size square; default 36
  iconSize?: number; // svg size; default 20
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function IconBadge({ kind, size = 36, iconSize = 20, style, testID }: IconBadgeProps) {
  const bg = kind === 'payment-status-fail' ? colors.danger : kind === 'payment-status-success' ? colors.success : colors.primary;
  const Icon = kind === 'cross' || kind === 'payment-status-fail' ? CrossIcon : CheckIcon;
  return (
    <View
      testID={testID}
      className="items-center justify-center rounded-[100px]"
      style={[style as any, { width: size, height: size, backgroundColor: bg }]}
    >
      <Icon width={iconSize} height={iconSize} color={colors.white} />
    </View>
  );
}

export const CheckBadge = (props: Omit<IconBadgeProps, 'kind'>) => <IconBadge kind="check" {...props} />;
export const CrossBadge = (props: Omit<IconBadgeProps, 'kind'>) => <IconBadge kind="cross" {...props} />;
export const PaymentStatusFailBadge = (props: Omit<IconBadgeProps, 'kind'>) => <IconBadge kind="payment-status-fail" {...props} />;
export const PaymentStatusSuccessBadge = (props: Omit<IconBadgeProps, 'kind'>) => <IconBadge kind="payment-status-success" {...props} />;

export default {
  VerifiedTag,
  PeopleTag,
  IconBadge,
  CheckBadge,
  CrossBadge,
  PaymentStatusFailBadge,
  PaymentStatusSuccessBadge,
};


