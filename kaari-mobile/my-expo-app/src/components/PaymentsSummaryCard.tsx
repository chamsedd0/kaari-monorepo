import React from 'react';
import { View, Text, ViewStyle, Pressable } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { SectionBadge } from './Badges';

type PaymentsSummaryCardProps = {
  periodLabel: string; // e.g., "April 2024"
  thisMonthAmount: string | number; // e.g., 3000$
  tenantsCount: number | string;
  monthAmount: string | number; // e.g., 1500$
  totalAmount: string | number; // e.g., 35000$
  sectionLabel?: string; // default Payments
  style?: ViewStyle | ViewStyle[];
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PaymentsSummaryCard({ periodLabel, thisMonthAmount, tenantsCount, monthAmount, totalAmount, sectionLabel = 'Payments', style }: PaymentsSummaryCardProps) {
  const p = useSharedValue(0);
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.white, colors.primaryTint2]),
  }));
  return (
    <AnimatedPressable
      className="rounded-2xl overflow-hidden"
      style={[bgStyle, style as any]}
      onPressIn={() => (p.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (p.value = withTiming(0, { duration: 160 }))}
    >
      <View className="px-4 pt-4">
        <View style={{ position: 'absolute', left: 0, top: 0 }}>
          <SectionBadge label={sectionLabel} variant="purple" />
        </View>
        <Text className="text-[12px] leading-[12px] self-end" style={{ color: colors.gray500, fontFamily: 'VisbyCF' }}>{periodLabel}</Text>
      </View>

      <View className="px-4 pt-2 items-center">
        <Text className="text-[40px] leading-[44px]" style={{ color: colors.primary, fontFamily: 'VisbyCF-Heavy' }}>
          {thisMonthAmount}
        </Text>
        <Text className="text-[16px] leading-[20px] mt-1" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Bold' }}>This month’s income</Text>
      </View>

      <View className="flex-row justify-between px-6 py-5">
        <Metric label="Tenants" value={String(tenantsCount)} />
        <Metric label="April" value={String(monthAmount)} />
        <Metric label="Total" value={String(totalAmount)} />
      </View>
    </AnimatedPressable>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-start">
      <Text className="text-[14px] leading-[14px] mb-2" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Bold' }}>{label}</Text>
      <Text className="text-[20px] leading-[22px]" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Heavy' }}>{value}</Text>
    </View>
  );
}

export default { PaymentsSummaryCard };


