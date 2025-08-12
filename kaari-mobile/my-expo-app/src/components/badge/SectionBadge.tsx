import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type SectionBadgeProps = {
  text: string;
  variant?: 'purple' | 'white';
};

export default function SectionBadge({ text, variant = 'purple' }: SectionBadgeProps) {
  const bg = variant === 'purple' ? colors.primaryTint2 : colors.white;
  const fg = variant === 'purple' ? colors.primary : colors.gray700;
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
        borderWidth: variant === 'white' ? 1 : 0,
        borderColor: colors.gray200,
      }}
    >
      <Text style={{ color: fg, fontWeight: '800', letterSpacing: 0.3, textTransform: 'uppercase', fontSize: 12 }}>{text}</Text>
    </View>
  );
}


