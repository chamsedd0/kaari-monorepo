import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';

export type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
};

export default function PrimaryButton({ label, onPress, disabled, loading, iconLeft, iconRight, fullWidth }: PrimaryButtonProps) {
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 48,
        paddingHorizontal: 18,
      }}
    >
      {!!iconLeft && <View style={{ marginRight: 4 }}>{iconLeft}</View>}
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={{ color: colors.white, fontWeight: '800' }}>{label}</Text>
      )}
      {!!iconRight && <View style={{ marginLeft: 4 }}>{iconRight}</View>}
    </View>
  );

  return (
    <PressableSurface onPress={onPress} disabled={disabled || loading} pressedBackground={colors.black} borderRadius={100}>
      <View style={{ backgroundColor: disabled ? colors.gray300 : colors.primary, borderRadius: 100, overflow: 'hidden', width: fullWidth ? '100%' : undefined }}>{content}</View>
    </PressableSurface>
  );
}


