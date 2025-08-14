import React from 'react';
import { View, Text, Image, ViewStyle, Pressable } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { SectionBadge } from './Badges';

type LatestReviewCardProps = {
  imageUri: string;
  title: string; // e.g., "Apartment - flat in the center of Agadir"
  userNameAge: string; // e.g., "John, 20"
  timeAgo: string; // e.g., "1 month"
  sectionVariant?: 'purple' | 'white' | 'gold';
  sectionLabel?: string;
  avatarUri?: string;
  style?: ViewStyle | ViewStyle[];
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LatestReviewCard({ imageUri, title, userNameAge, timeAgo, sectionVariant = 'purple', sectionLabel = 'Latest Review', avatarUri, style }: LatestReviewCardProps) {
  const p = useSharedValue(0);
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.white, colors.primaryTint2]),
  }));
  const renderTitle = () => {
    const parts = title.split(' - ');
    const type = parts[0] ?? title;
    const rest = parts.slice(1).join(' - ');
    return (
      <Text className="flex-1 text-[16px]" style={{ color: colors.gray700, maxWidth: '50%' }}>
        <Text style={{ fontFamily: 'VisbyCF-Bold', lineHeight: 16 }}>{type}</Text>
        {rest ? <Text style={{ fontFamily: 'VisbyCF', fontWeight: '500', lineHeight: 22 }}>{` - ${rest}`}</Text> : null}
      </Text>
    );
  };

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
          <SectionBadge label={sectionLabel} variant={sectionVariant} />
        </View>
      </View>
      <View className="px-4 py-4">
        <View className="flex-row items-start justify-between gap-3">
          {renderTitle()}
          <View className="flex-row items-center gap-3">
            <View className="items-start">
              <Text className="text-[14px] leading-[14px]" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Bold' }}>{userNameAge}</Text>
              <Text className="text-[12px] leading-[12px] mt-1" style={{ color: colors.gray500, fontFamily: 'VisbyCF' }}>{timeAgo}</Text>
            </View>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={{ width: 36, height: 36, borderRadius: 18 }} />
            ) : null}
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default { LatestReviewCard };


