import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type TopPickBadgeProps = { text?: string };

export default function TopPickBadge({ text = 'Top pick' }: TopPickBadgeProps) {
  return (
    <View
      style={{
        backgroundColor: colors.warning,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 100,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: colors.white, fontWeight: '700' }}>{text}</Text>
    </View>
  );
}


