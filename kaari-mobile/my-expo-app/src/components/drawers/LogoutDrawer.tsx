import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import SecondaryButton from '~/components/buttons/SecondaryButton';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type LogoutDrawerProps = {
  visible: boolean;
  onClose?: () => void;
  onLogout?: () => void;
};

export default function LogoutDrawer({ visible, onClose, onLogout }: LogoutDrawerProps) {
  if (!visible) return null;
  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Logout</Text>}
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1"><SecondaryButton label="Cancel" onPress={onClose} fullWidth /></View>
          <View className="flex-1"><PrimaryButton label="Logout" onPress={onLogout} fullWidth /></View>
        </View>
      }
      onClose={onClose}
    >
      <Text className="text-gray500">Are you sure you want to log out?</Text>
    </BottomDrawer>
  );
}


