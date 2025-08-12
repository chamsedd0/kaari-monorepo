import React from 'react';
import { View } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';

export type IconButtonProps = {
  onPress?: () => void;
  icon: React.ReactNode;
  background?: keyof typeof colors;
  size?: number; // diameter
};

export default function IconButton({ onPress, icon, background = 'primaryTint1', size = 40 }: IconButtonProps) {
  return (
    <PressableSurface onPress={onPress} pressedBackground={colors.primary} borderRadius={100}>
      <View style={{ width: size, height: size, borderRadius: 100, backgroundColor: colors[background], alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
    </PressableSurface>
  );
}


