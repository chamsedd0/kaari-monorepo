import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '~/theme/colors';
import Stars from '../primitives/Stars';

export type LatestReviewCardProps = {
  avatarUri: string;
  name: string;
  timeAgo: string;
  rating: number;
  comment: string;
};

export default function LatestReviewCard({ avatarUri, name, timeAgo, rating, comment }: LatestReviewCardProps) {
  return (
    <View className="rounded-2xl p-3.5" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray100 }}>
      <View className="flex-row items-center gap-2.5">
        <Image source={{ uri: avatarUri }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray100 }} />
        <View className="flex-1">
          <Text style={{ color: colors.gray700, fontWeight: '800' }}>{name}</Text>
          <Text style={{ color: colors.gray500 }}>{timeAgo}</Text>
        </View>
        <Stars rating={rating} />
      </View>
      <Text className="mt-2" style={{ color: colors.gray700 }}>{comment}</Text>
    </View>
  );
}


