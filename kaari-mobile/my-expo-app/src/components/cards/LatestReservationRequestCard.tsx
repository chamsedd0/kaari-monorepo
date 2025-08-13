import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import StatusTag from '~/components/tags/StatusTag';

export type LatestReservationRequestCardProps = {
  guestName: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'await' | 'success' | 'error' | 'paid';
};

export default function LatestReservationRequestCard({ guestName, date, status }: LatestReservationRequestCardProps) {
  const label = status === 'paid' ? 'Paid' : status[0].toUpperCase() + status.slice(1);
  const statusKey = (status === 'paid' ? 'success' : status) as Parameters<typeof StatusTag>[0]['status'];
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <Text className="text-gray700 font-extrabold">Latest reservation request</Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray500">{guestName} • {date}</Text>
        <StatusTag label={label} status={statusKey} />
      </View>
    </View>
  );
}


