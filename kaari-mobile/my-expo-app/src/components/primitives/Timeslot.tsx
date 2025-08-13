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
      <View className="rounded-[14px] px-[14px] py-[10px]" style={{ backgroundColor: isSelected ? colors.primaryTint2 : colors.white, borderColor: isSelected ? colors.primary : colors.gray200, borderWidth: 1 }}>
        <Text className="font-extrabold" style={{ color: colors.gray700 }}>{start}</Text>
        <Text className="mt-0.5" style={{ color: colors.gray500 }}>to {end}</Text>
      </View>
    </PressableSurface>
  );
}


