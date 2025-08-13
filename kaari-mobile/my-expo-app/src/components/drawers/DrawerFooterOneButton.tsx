import React from 'react';
import { View } from 'react-native';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type DrawerFooterOneButtonProps = {
  label: string;
  onPress?: () => void;
};

export default function DrawerFooterOneButton({ label, onPress }: DrawerFooterOneButtonProps) {
  return (
    <View className="px-4 py-3">
      <PrimaryButton label={label} onPress={onPress} fullWidth />
    </View>
  );
}


