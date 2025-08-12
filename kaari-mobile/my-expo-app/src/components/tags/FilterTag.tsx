import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type FilterTagProps = { label: string };

export default function FilterTag({ label }: FilterTagProps) {
  return (
    <View style={{ alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.white, borderColor: colors.gray200, borderWidth: 1, borderRadius: 100 }}>
      <Text style={{ color: colors.gray700, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}


