import React from 'react';
import { View } from 'react-native';
import PrimaryButton from '~/components/buttons/PrimaryButton';
import SecondaryButton from '~/components/buttons/SecondaryButton';

export type DrawerFooterTwoButtonsProps = {
  primaryLabel: string;
  onPrimaryPress?: () => void;
  secondaryLabel: string;
  onSecondaryPress?: () => void;
};

export default function DrawerFooterTwoButtons({ primaryLabel, onPrimaryPress, secondaryLabel, onSecondaryPress }: DrawerFooterTwoButtonsProps) {
  return (
    <View className="px-4 py-3 flex-row gap-3">
      <View className="flex-1">
        <SecondaryButton label={secondaryLabel} onPress={onSecondaryPress} fullWidth />
      </View>
      <View className="flex-1">
        <PrimaryButton label={primaryLabel} onPress={onPrimaryPress} fullWidth />
      </View>
    </View>
  );
}


