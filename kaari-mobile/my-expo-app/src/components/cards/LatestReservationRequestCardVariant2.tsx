import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import StatusTag from '~/components/tags/StatusTag';

export type LatestReservationRequestCardVariant2Props = {
  title?: string;
  name: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'await' | 'success' | 'error' | 'paid';
};

export default function LatestReservationRequestCardVariant2({ title = 'Latest request', name, date, status }: LatestReservationRequestCardVariant2Props) {
  const label = status === 'paid' ? 'Paid' : status[0].toUpperCase() + status.slice(1);
  const key = (status === 'paid' ? 'success' : status) as Parameters<typeof StatusTag>[0]['status'];
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <Text className="text-gray700 font-extrabold">{title}</Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray500">{name} • {date}</Text>
        <StatusTag label={label} status={key} />
      </View>
    </View>
  );
}


