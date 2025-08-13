import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import SecondaryButton from '~/components/buttons/SecondaryButton';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type UnlistPropertyDrawerProps = {
  visible: boolean;
  onClose?: () => void;
  onUnlist?: () => void;
};

export default function UnlistPropertyDrawer({ visible, onClose, onUnlist }: UnlistPropertyDrawerProps) {
  if (!visible) return null;
  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Unlist property</Text>}
      footer={
        <View className="flex-row gap-3">
          <View className="flex-1"><SecondaryButton label="Cancel" onPress={onClose} fullWidth /></View>
          <View className="flex-1"><PrimaryButton label="Unlist" onPress={onUnlist} fullWidth /></View>
        </View>
      }
      onClose={onClose}
    >
      <Text className="text-gray500">Are you sure you want to unlist this property?</Text>
    </BottomDrawer>
  );
}


