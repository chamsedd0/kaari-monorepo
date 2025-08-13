import React from 'react';
import { Text, View } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';

export type SecondaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
};

export default function SecondaryButton({ label, onPress, disabled, iconLeft, iconRight, fullWidth }: SecondaryButtonProps) {
  return (
    <PressableSurface onPress={onPress} disabled={disabled} pressedBackground={colors.primary} borderRadius={100}>
      <View className={`flex-row items-center justify-center gap-2 h-12 px-[18px] rounded-[100px] border ${fullWidth ? 'w-full' : ''}`} style={{ backgroundColor: colors.white, borderColor: colors.primary }}>
        {!!iconLeft && <View style={{ marginRight: 4 }}>{iconLeft}</View>}
        <Text style={{ color: colors.primary, fontWeight: '800' }}>{label}</Text>
        {!!iconRight && <View style={{ marginLeft: 4 }}>{iconRight}</View>}
      </View>
    </PressableSurface>
  );
}


