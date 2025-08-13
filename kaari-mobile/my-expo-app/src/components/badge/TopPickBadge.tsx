import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type TopPickBadgeProps = { text?: string };

export default function TopPickBadge({ text = 'Top pick' }: TopPickBadgeProps) {
  return (
    <View className="self-start px-2.5 py-1" style={{ backgroundColor: colors.warning, borderTopLeftRadius: 100, borderBottomRightRadius: 100, borderTopRightRadius: 16, borderBottomLeftRadius: 16 }}>
      <Text className="text-white font-bold">{text}</Text>
    </View>
  );
}


