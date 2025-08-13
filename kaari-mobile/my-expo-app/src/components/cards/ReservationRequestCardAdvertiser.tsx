import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import StatusTag from '~/components/tags/StatusTag';

export type AdvertiserReservationStatus = 'sent' | 'approved' | 'pending' | 'rejected' | 'payment-failed' | 'success';

export type ReservationRequestCardAdvertiserProps = {
  tenantName: string;
  status: AdvertiserReservationStatus;
  date: string;
};

export default function ReservationRequestCardAdvertiser({ tenantName, status, date }: ReservationRequestCardAdvertiserProps) {
  const label = status[0].toUpperCase() + status.slice(1).replace('-', ' ');
  const statusKey = (status === 'success' ? 'success' : status === 'payment-failed' ? 'error' : (status as any)) as Parameters<typeof StatusTag>[0]['status'];
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <Text className="text-gray700 font-extrabold">Reservation request</Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray500">{tenantName} • {date}</Text>
        <StatusTag label={label} status={statusKey} />
      </View>
    </View>
  );
}


