import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type RecommendUsCardProps = {
  title?: string;
  subtitle?: string;
  onShare?: () => void;
};

export default function RecommendUsCard({ title = 'Recommend us', subtitle = 'Share the app with your friends', onShare }: RecommendUsCardProps) {
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <Text className="text-gray700 font-extrabold">{title}</Text>
      <Text className="text-gray500">{subtitle}</Text>
      <PrimaryButton label="Share" onPress={onShare} />
    </View>
  );
}


