import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type DrawerStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'success'
  | 'payment-failed'
  | 'refund-processing'
  | 'refund-failed'
  | 'cancellation-under-review'
  | 'cancellation-approved'
  | 'cancellation-request-denied';

const statusMap: Record<DrawerStatus, { chipBg: keyof typeof colors; chipFg: keyof typeof colors; headerBg: keyof typeof colors; label: string }> = {
  approved: { chipBg: 'success', chipFg: 'white', headerBg: 'primaryTint2', label: 'Approved' },
  pending: { chipBg: 'info', chipFg: 'white', headerBg: 'primaryTint2', label: 'Pending' },
  rejected: { chipBg: 'danger', chipFg: 'white', headerBg: 'primaryTint2', label: 'Rejected' },
  success: { chipBg: 'success', chipFg: 'white', headerBg: 'primaryTint2', label: 'Success' },
  'payment-failed': { chipBg: 'danger', chipFg: 'white', headerBg: 'primaryTint2', label: 'Payment failed' },
  'refund-processing': { chipBg: 'info', chipFg: 'white', headerBg: 'primaryTint2', label: 'Refund processing' },
  'refund-failed': { chipBg: 'danger', chipFg: 'white', headerBg: 'primaryTint2', label: 'Refund failed' },
  'cancellation-under-review': { chipBg: 'primary', chipFg: 'white', headerBg: 'primaryTint2', label: 'Cancellation under review' },
  'cancellation-approved': { chipBg: 'success', chipFg: 'white', headerBg: 'primaryTint2', label: 'Cancellation approved' },
  'cancellation-request-denied': { chipBg: 'danger', chipFg: 'white', headerBg: 'primaryTint2', label: 'Cancellation request denied' },
};

export type DrawerStatusHeaderProps = {
  status: DrawerStatus;
  title: string;
  subtitle?: string;
};

export default function DrawerStatusHeader({ status, title, subtitle }: DrawerStatusHeaderProps) {
  const s = statusMap[status];
  return (
    <View className="border-b px-4 py-3 rounded-t-[20px]" style={{ backgroundColor: colors[s.headerBg], borderColor: colors.gray100 }}>
      <View className="self-start rounded-[100px] px-3 py-1.5" style={{ backgroundColor: colors[s.chipBg] }}>
        <Text style={{ color: colors[s.chipFg], fontWeight: '800' }}>{s.label}</Text>
      </View>
      <Text className="mt-2" style={{ color: colors.gray700, fontSize: 18, fontWeight: '800' }}>{title}</Text>
      {!!subtitle && <Text className="mt-1" style={{ color: colors.gray500 }}>{subtitle}</Text>}
    </View>
  );
}


