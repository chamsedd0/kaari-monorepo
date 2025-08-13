import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import Stars from '~/components/primitives/Stars';

export type PropertyReviewCardProps = {
  title: string;
  reviewer: string;
  rating: number;
  comment: string;
};

export default function PropertyReviewCard({ title, reviewer, rating, comment }: PropertyReviewCardProps) {
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <Text className="text-gray700 font-extrabold">{title}</Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray500">{reviewer}</Text>
        <Stars rating={rating} />
      </View>
      <Text className="text-gray700">{comment}</Text>
    </View>
  );
}


