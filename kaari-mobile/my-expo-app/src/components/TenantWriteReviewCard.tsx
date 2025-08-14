import React from 'react';
import { View, Text, Image, Pressable, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { SectionBadge } from './Badges';
import { CardDualButton } from './Button';

type TenantWriteReviewCardProps = {
  imageUri: string;
  title: string; // split by " - " for bold type
  dateLabel: string; // e.g., 21.08.2024
  nameLabel: string; // e.g., Leonardo V.
  onSkip?: () => void;
  onWriteReview?: () => void;
  sectionLabel?: string; // default Latest Review
  style?: ViewStyle | ViewStyle[];
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TenantWriteReviewCard({ imageUri, title, dateLabel, nameLabel, onSkip, onWriteReview, sectionLabel = 'Latest Review', style }: TenantWriteReviewCardProps) {
  const p = useSharedValue(0);
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.white, colors.primaryTint2]),
  }));

  const parts = title.split(' - ');
  const type = parts[0] ?? title;
  const rest = parts.slice(1).join(' - ');

  return (
    <AnimatedPressable
      className="rounded-2xl overflow-hidden"
      style={[bgStyle, style as any]}
      onPressIn={() => (p.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (p.value = withTiming(0, { duration: 160 }))}
    >
      <View>
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 140 }} resizeMode="cover" />
        <View style={{ position: 'absolute', left: 0, top: 0 }}>
          <SectionBadge label={sectionLabel} variant="purple" />
        </View>
      </View>
      <View className="px-4 py-3">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-[16px]" style={{ color: colors.gray700, maxWidth: '50%' }}>
            <Text style={{ fontFamily: 'VisbyCF-Bold', lineHeight: 16 }}>{type}</Text>
            {rest ? <Text style={{ fontFamily: 'VisbyCF', fontWeight: '500', lineHeight: 22 }}>{` - ${rest}`}</Text> : null}
          </Text>
          <View className="items-start">
            <Text className="text-[12px] leading-[16px]" style={{ color: colors.gray500, fontFamily: 'VisbyCF' }}>{dateLabel}</Text>
            <Text className="text-[14px] leading-[16px] mt-1" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Bold' }}>{nameLabel}</Text>
          </View>
        </View>
      </View>
      <CardDualButton leftLabel="Skip for now" rightLabel="Write a Review" onLeftPress={onSkip} onRightPress={onWriteReview} />
    </AnimatedPressable>
  );
}

export default { TenantWriteReviewCard };


