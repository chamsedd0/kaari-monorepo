import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { colors } from '~/theme/colors';
import { bgColorClass, textColorClass } from '~/utils/nativewind';

export type TextWithBgProps = {
  text: string;
  color?: keyof typeof colors; // text color key from theme
  background?: keyof typeof colors; // background color key from theme
  radius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  style?: ViewStyle | ViewStyle[];
  variant?: 'purple' | 'white';
};

export default function TextWithBg({
  text,
  color = 'black',
  background = 'primaryTint2',
  radius = 12,
  paddingHorizontal = 14,
  paddingVertical = 8,
  style,
  variant,
}: TextWithBgProps) {
  const isWhite = variant === 'white' || background === 'white';
  return (
    <View className={`${bgColorClass(background)} rounded-[${radius}px] px-[${paddingHorizontal}px] py-[${paddingVertical}px] ${isWhite ? 'border' : ''}`} style={[isWhite ? { borderColor: colors.gray200 } : null, style]}>
      <Text className={`font-bold ${textColorClass(color)}`}>{text}</Text>
    </View>
  );
}


