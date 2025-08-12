import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type CountTagProps = { count: number; label?: string };

export default function CountTag({ count, label }: CountTagProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.gray100, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100 }}>
      <View style={{ minWidth: 18, height: 18, paddingHorizontal: 6, borderRadius: 999, backgroundColor: colors.gray300, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.white, fontSize: 12, fontWeight: '800' }}>{count}</Text>
      </View>
      {!!label && <Text style={{ color: colors.gray700, fontWeight: '700' }}>{label}</Text>}
    </View>
  );
}


