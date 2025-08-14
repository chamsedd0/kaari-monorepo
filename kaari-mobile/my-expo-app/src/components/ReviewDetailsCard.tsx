import React from 'react';
import { View, Text, Image, Pressable, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import ArrowRightIcon from '../../assets/Icon_Arrow_Right.svg';
import { Rating } from './Rating';

type ReviewDetailsCardProps = {
  imageUri: string;
  title: string; // split by " - " for bold type
  ratedOn: string; // e.g., 27.08.2024
  lengthOfStay: string; // e.g., 1 month
  reviewText: string;
  reviewerName: string;
  reviewerSince: string; // e.g., On Kaari since August 2024
  reviewerAvatarUri: string;
  ratings: { label: string; value: number }[]; // 0..5
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ReviewDetailsCard({
  imageUri,
  title,
  ratedOn,
  lengthOfStay,
  reviewText,
  reviewerName,
  reviewerSince,
  reviewerAvatarUri,
  ratings,
  onPress,
  style,
}: ReviewDetailsCardProps) {
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
      onPress={onPress}
    >
      <Image source={{ uri: imageUri }} style={{ width: '100%', height: 160 }} resizeMode="cover" />

      <View className="px-4 pt-4 pb-10">
        <Text className="text-[16px]" style={{ color: colors.gray700 }}>
          <Text style={{ fontFamily: 'VisbyCF-Bold', lineHeight: 16 }}>{type}</Text>
          {rest ? <Text style={{ fontFamily: 'VisbyCF', fontWeight: '500', lineHeight: 22 }}>{` - ${rest}`}</Text> : null}
        </Text>

        <View className="flex-row justify-between mt-3">
          <Text className="text-[12px]" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Bold' }}>Rated on: <Text style={{ fontFamily: 'VisbyCF', fontWeight: '500' }}>{ratedOn}</Text></Text>
          <Text className="text-[12px]" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Bold' }}>Length of stay: <Text style={{ fontFamily: 'VisbyCF', fontWeight: '500' }}>{lengthOfStay}</Text></Text>
        </View>

        <Text className="mt-3 text-[12px] leading-[18px]" style={{ color: colors.gray700, fontFamily: 'VisbyCF' }}>{reviewText}</Text>

        <View className="flex-row items-center mt-3 gap-1">
          <Text className="text-[12px]" style={{ color: colors.gray500, fontFamily: 'VisbyCF', fontWeight: '500' }}>See More</Text>
          <ArrowRightIcon width={14} height={14} color={colors.gray500} />
        </View>

        <View className="flex-row items-center mt-4 gap-3">
          <Image source={{ uri: reviewerAvatarUri }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          <View>
            <Text className="text-[14px]" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Bold' }}>{reviewerName}</Text>
            <Text className="text-[12px] mt-1" style={{ color: colors.gray500, fontFamily: 'VisbyCF' }}>{reviewerSince}</Text>
          </View>
        </View>

        <View className="mt-4 gap-3">
          {ratings.map((r, idx) => (
            <View key={idx} className="flex-row items-center justify-between">
              <Text className="text-[14px]" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Bold' }}>{r.label}</Text>
              <Rating value={r.value} readOnly size={16} spacing={3} />
            </View>
          ))}
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default { ReviewDetailsCard };


