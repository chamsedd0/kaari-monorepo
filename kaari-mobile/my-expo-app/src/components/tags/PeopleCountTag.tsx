import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PeopleIcon from '~/../assets/Icon_People.svg';

export type PeopleCountTagProps = {
  count: number;
  variant?: 'purple' | 'white';
};

export default function PeopleCountTag({ count, variant = 'purple' }: PeopleCountTagProps) {
  const bg = variant === 'purple' ? colors.primaryTint2 : colors.white;
  const fg = variant === 'purple' ? colors.primary : colors.gray700;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: bg, borderRadius: 100, borderWidth: variant === 'white' ? 1 : 0, borderColor: colors.gray200 }}>
      <PeopleIcon width={14} height={14} color={fg} />
      <Text style={{ color: fg, fontWeight: '700' }}>{count} people</Text>
    </View>
  );
}


