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
    <View className="self-start rounded-[100px] px-2 py-1" style={{ backgroundColor: colors[background] }}>
      <Text style={{ color: colors[color], fontWeight: '600' }}>{text}</Text>
    </View>
  );
}


