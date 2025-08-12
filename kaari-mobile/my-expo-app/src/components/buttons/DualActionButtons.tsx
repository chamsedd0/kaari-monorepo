import React from 'react';
import { View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export type DualActionButtonsProps = {
  primaryLabel: string;
  onPrimaryPress?: () => void;
  secondaryLabel: string;
  onSecondaryPress?: () => void;
};

export default function DualActionButtons({ primaryLabel, onPrimaryPress, secondaryLabel, onSecondaryPress }: DualActionButtonsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <SecondaryButton label={secondaryLabel} onPress={onSecondaryPress} fullWidth />
      </View>
      <View style={{ flex: 1 }}>
        <PrimaryButton label={primaryLabel} onPress={onPrimaryPress} fullWidth />
      </View>
    </View>
  );
}


