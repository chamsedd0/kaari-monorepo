import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { colors } from '~/theme/colors';

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
    <View
      style={[
        {
          backgroundColor: colors[background],
          borderRadius: radius,
          paddingHorizontal,
          paddingVertical,
          borderWidth: isWhite ? 1 : 0,
          borderColor: isWhite ? colors.gray200 : 'transparent',
        },
        style,
      ]}
    >
      <Text style={{ color: colors[color], fontWeight: '700' }}>{text}</Text>
    </View>
  );
}


