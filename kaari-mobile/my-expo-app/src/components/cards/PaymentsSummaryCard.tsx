import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type PaymentsSummaryCardProps = {
  total: string;
  nextPayout?: string;
  pending?: string;
};

export default function PaymentsSummaryCard({ total, nextPayout, pending }: PaymentsSummaryCardProps) {
  return (
    <View className="rounded-2xl p-3.5" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray100 }}>
      <Text style={{ color: colors.gray700, fontWeight: '800' }}>Payments</Text>
      <View className="flex-row items-end justify-between mt-2">
        <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '800' }}>{total}</Text>
        {!!nextPayout && <Text style={{ color: colors.gray500 }}>Next payout: {nextPayout}</Text>}
      </View>
      {!!pending && <Text className="mt-1" style={{ color: colors.gray500 }}>Pending: {pending}</Text>}
    </View>
  );
}


