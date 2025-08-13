import React from 'react';
import { View } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';

export type CircularIconButtonProps = {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number; // diameter
  background?: keyof typeof colors;
};

export default function CircularIconButton({ icon, onPress, size = 44, background = 'primaryTint2' }: CircularIconButtonProps) {
  return (
    <PressableSurface onPress={onPress} borderRadius={100} pressedBackground={colors.primary}>
      <View className="items-center justify-center" style={{ width: size, height: size, borderRadius: 100, backgroundColor: colors[background] }}>
        {icon}
      </View>
    </PressableSurface>
  );
}


