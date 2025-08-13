import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type WriteReviewCardProps = {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
};

export default function WriteReviewCard({ title = 'Write a review', subtitle = 'Share your experience', onPress }: WriteReviewCardProps) {
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <Text className="text-gray700 font-extrabold">{title}</Text>
      <Text className="text-gray500">{subtitle}</Text>
      <PrimaryButton label="Write now" onPress={onPress} />
    </View>
  );
}


