import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type StatusTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';
export type StatusName = 'pending' | 'approved' | 'success' | 'rejected' | 'error' | 'await';

export type StatusTagProps = {
  label: string;
  tone?: StatusTone; // legacy
  status?: StatusName; // preferred
};

const statusToBg: Record<StatusName, keyof typeof colors> = {
  pending: 'info', // blue
  approved: 'success', // green
  success: 'success', // green
  rejected: 'danger', // red
  error: 'danger', // red
  await: 'primary', // purple
};

const toneToBg: Record<StatusTone, keyof typeof colors> = {
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
  neutral: 'gray300',
};

export default function StatusTag({ label, tone, status }: StatusTagProps) {
  const bgColorKey = status ? statusToBg[status] : toneToBg[tone ?? 'neutral'];
  const bgColor = colors[bgColorKey];
  return (
    <View style={{ alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: bgColor }}>
      <Text style={{ color: colors.white, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}


