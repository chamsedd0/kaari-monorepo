import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import StatusTag from '~/components/tags/StatusTag';

export type TenantReservationStatus =
  | 'awaiting-response'
  | 'accepted-awaiting-payment'
  | 'paid'
  | 'cancellation-under-review'
  | 'cancellation-declined'
  | 'refund-processing'
  | 'refund-failed'
  | 'window-after-movedin'
  | 'rejected'
  | 'payment-failed';

export type ReservationRequestCardTenantProps = {
  propertyTitle: string;
  date: string;
  people: number;
  status: TenantReservationStatus;
};

function mapStatus(status: TenantReservationStatus): { label: string; key: Parameters<typeof StatusTag>[0]['status'] } {
  switch (status) {
    case 'awaiting-response':
      return { label: 'Awaiting response', key: 'pending' };
    case 'accepted-awaiting-payment':
      return { label: 'Awaiting payment', key: 'await' };
    case 'paid':
      return { label: 'Paid', key: 'success' };
    case 'cancellation-under-review':
      return { label: 'Under review', key: 'await' };
    case 'cancellation-declined':
      return { label: 'Declined', key: 'rejected' };
    case 'refund-processing':
      return { label: 'Refund processing', key: 'await' };
    case 'refund-failed':
      return { label: 'Refund failed', key: 'error' };
    case 'window-after-movedin':
      return { label: 'Active', key: 'success' };
    case 'rejected':
      return { label: 'Rejected', key: 'rejected' };
    case 'payment-failed':
      return { label: 'Payment failed', key: 'error' };
  }
}

export default function ReservationRequestCardTenant({ propertyTitle, date, people, status }: ReservationRequestCardTenantProps) {
  const mapped = mapStatus(status);
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray700 font-extrabold">{propertyTitle}</Text>
        <StatusTag label={mapped.label} status={mapped.key} />
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray500">{date}</Text>
        <Text className="text-gray500">{people} people</Text>
      </View>
    </View>
  );
}


