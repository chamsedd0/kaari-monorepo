import React from 'react';
import { View, ViewStyle } from 'react-native';
import { VText } from './typography';
import { colors } from '../theme/colors';

export type AlertBannerProps = {
  text: string;
  Icon?: React.ComponentType<any>; // pass an imported SVG component
  color?: string; // text/icon color; default primaryDark
  backgroundColor?: string; // default primaryTint1
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function AlertBanner({ text, Icon, color = colors.primaryDark, backgroundColor = colors.primaryTint1, style, testID }: AlertBannerProps) {
  return (
    <View
      testID={testID}
      className="flex-row items-center px-4 py-4"
      // eslint-disable-next-line react-native/no-inline-styles
      style={[{ backgroundColor, borderRadius: 16 }, style as any]}
    >
      {Icon ? (
        <View className="mr-3">
          <Icon width={27} height={27} color={color} stroke={color} fill={color} />
        </View>
      ) : null}
      <VText className="flex-1 text-[12px] leading-[16px]" weight="medium" style={{ color }}>
        {text}
      </VText>
    </View>
  );
}

export default { AlertBanner };


