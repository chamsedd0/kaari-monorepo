import React from 'react';
import { View } from 'react-native';
import { colors } from '~/theme/colors';
import StarIcon from '~/../assets/Icon_Star.svg';

export type StarsProps = {
  rating: number; // 0..5
  size?: number; // square size per star
  color?: keyof typeof colors;
};

export default function Stars({ rating, size = 16, color = 'warning' }: StarsProps) {
  const filled = Math.max(0, Math.min(5, rating));
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i + 1 <= Math.floor(filled);
        const isHalf = !isFull && i < filled; // simple half approximation
        return (
          <View key={i} style={{ width: size, height: size }}>
            <StarIcon width={size} height={size} color={isFull || isHalf ? colors[color] : colors.gray200} />
          </View>
        );
      })}
    </View>
  );
}


