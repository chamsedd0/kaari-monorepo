import React from 'react';
import { Text, View } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';

export type TextButtonProps = {
  label: string;
  onPress?: () => void;
  bold?: boolean;
  color?: keyof typeof colors;
};

export default function TextButton({ label, onPress, bold, color = 'primary' }: TextButtonProps) {
  return (
    <PressableSurface onPress={onPress} pressedBackground={colors[color]} borderRadius={100}>
      <View style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 100 }}>
        <Text style={{ color: colors[color], fontWeight: bold ? '700' as const : '500' as const }}>{label}</Text>
      </View>
    </PressableSurface>
  );
}


