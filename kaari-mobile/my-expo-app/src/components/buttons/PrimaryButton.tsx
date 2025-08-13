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
    <View className="flex-row items-center justify-center gap-2 h-12 px-[18px]">
      {!!iconLeft && <View style={{ marginRight: 4 }}>{iconLeft}</View>}
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text className="text-white font-extrabold">{label}</Text>
      )}
      {!!iconRight && <View style={{ marginLeft: 4 }}>{iconRight}</View>}
    </View>
  );

  return (
    <PressableSurface onPress={onPress} disabled={disabled || loading} pressedBackground={colors.black} borderRadius={100}>
      <View className={`${fullWidth ? 'w-full' : ''} rounded-[100px] overflow-hidden`} style={{ backgroundColor: disabled ? colors.gray300 : colors.primary }}>{content}</View>
    </PressableSurface>
  );
}


