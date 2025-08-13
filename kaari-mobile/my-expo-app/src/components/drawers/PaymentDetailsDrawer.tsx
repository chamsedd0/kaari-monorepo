import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import { colors } from '~/theme/colors';

export type PaymentDetailsDrawerProps = {
  visible: boolean;
  onClose?: () => void;
  amount: string;
  method: string;
  date?: string;
};

export default function PaymentDetailsDrawer({ visible, onClose, amount, method, date }: PaymentDetailsDrawerProps) {
  if (!visible) return null;
  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Payment details</Text>}
      onClose={onClose}
    >
      <View className="gap-2">
        <Row label="Amount" value={amount} />
        <Row label="Method" value={method} />
        {!!date && <Row label="Date" value={date} />}
      </View>
    </BottomDrawer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-gray500">{label}</Text>
      <Text className="text-gray700 font-extrabold">{value}</Text>
    </View>
  );
}


