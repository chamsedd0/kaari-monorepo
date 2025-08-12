import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import VerifiedIcon from '~/../assets/Icon_Verified.svg';

export type VerifiedTagProps = {
  label?: string;
  variant?: 1 | 2; // two PNG variants
};

export default function VerifiedTag({ label = 'Verified', variant = 1 }: VerifiedTagProps) {
  const bg = variant === 1 ? colors.primaryTint2 : colors.white;
  const fg = colors.primary;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: bg, borderRadius: 100, borderWidth: variant === 2 ? 1 : 0, borderColor: colors.primary }}>
      <VerifiedIcon width={14} height={14} color={fg} />
      <Text style={{ color: fg, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}


