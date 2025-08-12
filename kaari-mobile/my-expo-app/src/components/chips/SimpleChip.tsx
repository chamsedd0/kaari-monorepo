import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type SimpleChipProps = {
  text: string;
};

export default function SimpleChip({ text }: SimpleChipProps) {
  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.white, borderRadius: 100, borderColor: colors.gray200, borderWidth: 1 }}>
      <Text style={{ color: colors.gray700 }}>{text}</Text>
    </View>
  );
}


