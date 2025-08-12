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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height: 48,
          paddingHorizontal: 18,
          backgroundColor: colors.white,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: colors.primary,
          width: fullWidth ? '100%' : undefined,
        }}
      >
        {!!iconLeft && <View style={{ marginRight: 4 }}>{iconLeft}</View>}
        <Text style={{ color: colors.primary, fontWeight: '800' }}>{label}</Text>
        {!!iconRight && <View style={{ marginLeft: 4 }}>{iconRight}</View>}
      </View>
    </PressableSurface>
  );
}


