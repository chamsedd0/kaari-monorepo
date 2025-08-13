import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import StatusTag from '~/components/tags/StatusTag';
import PeopleIcon from '~/../assets/Icon_People.svg';

export type RequestStatus = 'pending' | 'await' | 'approved' | 'rejected' | 'paid' | 'success' | 'error';

export type RequestCardProps = {
  name: string;
  status: RequestStatus;
  moveInDate: string; // ISO or display
  people: number;
};

function mapStatusToLabelAndKey(status: RequestStatus): { label: string; key: 'pending' | 'await' | 'approved' | 'success' | 'rejected' | 'error' } {
  switch (status) {
    case 'pending':
      return { label: 'Pending', key: 'pending' };
    case 'await':
      return { label: 'Await', key: 'await' };
    case 'approved':
      return { label: 'Approved', key: 'approved' };
    case 'paid':
    case 'success':
      return { label: 'Paid', key: 'success' };
    case 'rejected':
      return { label: 'Rejected', key: 'rejected' };
    case 'error':
      return { label: 'Error', key: 'error' };
  }
}

export function RequestCard({ name, status, moveInDate, people }: RequestCardProps) {
  const mapped = mapStatusToLabelAndKey(status);
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <View className="flex-row items-center justify-between">
        <Text style={{ color: colors.gray700, fontWeight: '800' }}>{name}</Text>
        <StatusTag label={mapped.label} status={mapped.key} />
      </View>
      <View className="flex-row items-center justify-between">
        <Text style={{ color: colors.gray500 }}>Move-in: {moveInDate}</Text>
        <View className="flex-row items-center gap-1.5">
          <PeopleIcon width={16} height={16} color={colors.gray500} />
          <Text style={{ color: colors.gray500 }}>{people}</Text>
        </View>
      </View>
    </View>
  );
}

export default RequestCard;


