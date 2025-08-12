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
    <View style={{ borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray100, padding: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image source={{ uri: avatarUri }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray100 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.gray700, fontWeight: '800' }}>{name}</Text>
          <Text style={{ color: colors.gray500 }}>{timeAgo}</Text>
        </View>
        <Stars rating={rating} />
      </View>
      <Text style={{ color: colors.gray700, marginTop: 8 }}>{comment}</Text>
    </View>
  );
}


