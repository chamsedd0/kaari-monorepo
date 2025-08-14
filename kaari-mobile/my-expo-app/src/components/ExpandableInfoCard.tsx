import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import ProtectionIcon from '../../assets/Icon_TenantProtection.svg';
import CheckIcon from '../../assets/Icon_Check.svg';
import ArrowRightIcon from '../../assets/Icon_Arrow_Right.svg';
import CloseIcon from '../../assets/Icon_Cross.svg';

export type ExpandableItem = { title: string; text: string };

export type ExpandableInfoCardProps = {
  title: string;
  subtitle: string;
  items: ExpandableItem[];
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function ExpandableInfoCard({ title, subtitle, items, style, testID }: ExpandableInfoCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Animated.View
      testID={testID}
      className="rounded-2xl overflow-hidden"
      style={[{ backgroundColor: colors.primaryTint2 }, style as any]}
      layout={LinearTransition.springify().damping(26).stiffness(200)}
    >
      {/* Header block */}
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-center">
          <ProtectionIcon width={22} height={22} color={colors.primary} stroke={colors.primary} />
          <VText className="ml-2 text-[16px] leading-[16px]" weight="bold" style={{ color: colors.primaryDark }}>
            {title}
          </VText>
        </View>
        <VText className="mt-3 text-[14px] leading-[20px]" weight="medium" style={{ color: colors.primaryDark }}>
          {subtitle}
        </VText>
      </View>

      {/* Details block */}
      {expanded ? (
        <Animated.View
          entering={FadeInDown.springify().damping(26).stiffness(200).mass(0.6)}
          exiting={FadeOutUp.duration(160)}
        >
          <View className="px-4 pb-4">
            {items.map((it, idx) => (
              <View key={idx} className="mt-4 ml-3">
                <View className="flex-row items-center pl-1">
                  <CheckIcon width={14} height={14} color={colors.primaryDark} stroke={colors.primaryDark} />
                  <VText className="ml-2 text-[14px] leading-[14px]" weight="bold" style={{ color: colors.primaryDark }}>
                    {it.title}
                  </VText>
                </View>
                <VText className="mt-2 text-[12px] leading-[16px] pl-7" weight="medium" style={{ color: colors.primaryDark }}>
                  {it.text}
                </VText>
              </View>
            ))}
            {/* Footer control */}
            <View className="flex-row justify-end mt-4">
              <Pressable accessibilityRole="button" className="flex-row items-center" onPress={() => setExpanded(false)}>
                <VText className="text-[14px] leading-[20px]" weight="medium" style={{ color: colors.primary }}>Close</VText>
                <CloseIcon className="ml-1" width={12} height={12} color={colors.primary} stroke={colors.primary} />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      ) : null}

      {/* Collapsed footer (See more) shown when not expanded) */}
      {!expanded ? (
        <View className="px-4 pb-3">
          <View className="flex-row justify-end">
            <Pressable accessibilityRole="button" className="flex-row items-center" onPress={() => setExpanded(true)}>
              <VText className="text-[14px] leading-[20px]" weight="medium" style={{ color: colors.primary }}>See more</VText>
              <ArrowRightIcon className="ml-1" width={12} height={12} color={colors.primary} stroke={colors.primary} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </Animated.View>
  );
}

export default { ExpandableInfoCard };


