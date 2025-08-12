import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type TagProps = {
  text: string;
  color?: keyof typeof colors;
  background?: keyof typeof colors;
};

export default function Tag({ text, color = 'primary', background = 'primaryTint2' }: TagProps) {
  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100, backgroundColor: colors[background], alignSelf: 'flex-start' }}>
      <Text style={{ color: colors[color], fontWeight: '600' }}>{text}</Text>
    </View>
  );
}


