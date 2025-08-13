import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type ReservationRequestDrawerProps = {
  visible: boolean;
  onClose?: () => void;
  onSend?: () => void;
};

export default function ReservationRequestDrawer({ visible, onClose, onSend }: ReservationRequestDrawerProps) {
  if (!visible) return null;
  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Reservation request</Text>}
      footer={<PrimaryButton label="Send request" onPress={() => { onSend?.(); onClose?.(); }} fullWidth />}
      onClose={onClose}
    >
      <View className="gap-3">
        <Text className="text-gray500">Review details before sending your reservation request.</Text>
      </View>
    </BottomDrawer>
  );
}


