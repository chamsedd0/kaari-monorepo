import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type StatusTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export type StatusTagProps = {
  label: string;
  tone?: StatusTone;
};

const toneToColors: Record<StatusTone, { bg: keyof typeof colors; fg: keyof typeof colors }> = {
  success: { bg: 'primaryTint2', fg: 'success' },
  danger: { bg: 'primaryTint2', fg: 'danger' },
  warning: { bg: 'primaryTint2', fg: 'warning' },
  info: { bg: 'primaryTint2', fg: 'info' },
  neutral: { bg: 'gray100', fg: 'gray700' },
};

export default function StatusTag({ label, tone = 'neutral' }: StatusTagProps) {
  const { bg, fg } = toneToColors[tone];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors[bg], borderRadius: 100 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors[fg] }} />
      <Text style={{ color: colors[fg], fontWeight: '700' }}>{label}</Text>
    </View>
  );
}


