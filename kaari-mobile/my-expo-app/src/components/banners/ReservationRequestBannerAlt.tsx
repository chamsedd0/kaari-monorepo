import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import StatusTag from '~/components/tags/StatusTag';

export type ReservationRequestBannerAltProps = {
  title: string;
  subtitle?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'await' | 'success' | 'error';
};

export default function ReservationRequestBannerAlt({ title, subtitle, status = 'pending' }: ReservationRequestBannerAltProps) {
  return (
    <View className="rounded-2xl p-3.5 gap-2.5" style={{ backgroundColor: colors.primaryTint2 }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-primary font-extrabold">{title}</Text>
        <StatusTag label={status[0].toUpperCase() + status.slice(1)} status={status} />
      </View>
      {!!subtitle && <Text className="text-gray700">{subtitle}</Text>}
    </View>
  );
}


