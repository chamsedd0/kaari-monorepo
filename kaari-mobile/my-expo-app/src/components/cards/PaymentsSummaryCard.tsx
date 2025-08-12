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
    <View style={{ borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray100, padding: 14 }}>
      <Text style={{ color: colors.gray700, fontWeight: '800' }}>Payments</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '800' }}>{total}</Text>
        {!!nextPayout && <Text style={{ color: colors.gray500 }}>Next payout: {nextPayout}</Text>}
      </View>
      {!!pending && <Text style={{ color: colors.gray500, marginTop: 4 }}>Pending: {pending}</Text>}
    </View>
  );
}


