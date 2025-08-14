import React from 'react';
import { View } from 'react-native';

type PaginationDotsProps = {
  count: number;
  activeIndex: number;
  size?: number;
  gap?: number;
  activeOpacity?: number;
};

export function PaginationDots({ count, activeIndex, size = 6, gap = 6, activeOpacity = 1 }: PaginationDotsProps) {
  return (
    <View className="flex-row items-center" style={{ columnGap: gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          className="rounded-full bg-white"
          style={{ width: size, height: size, opacity: i === activeIndex ? activeOpacity : 0.35 }}
        />
      ))}
    </View>
  );
}

export default { PaginationDots };


