import React from 'react';
import { View, Text } from 'react-native';
import PressableSurface from './PressableSurface';
import { colors } from '~/theme/colors';

export type TimeslotProps = {
  start: string; // '09:00'
  end: string; // '10:00'
  isSelected?: boolean;
  onPress?: () => void;
};

export default function Timeslot({ start, end, isSelected, onPress }: TimeslotProps) {
  return (
    <PressableSurface onPress={onPress} pressedBackground={colors.primary}>
      <View
        style={{
          backgroundColor: isSelected ? colors.primaryTint2 : colors.white,
          borderColor: isSelected ? colors.primary : colors.gray200,
          borderWidth: 1,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: colors.gray700, fontWeight: '800' }}>{start}</Text>
        <Text style={{ color: colors.gray500, marginTop: 2 }}>to {end}</Text>
      </View>
    </PressableSurface>
  );
}


