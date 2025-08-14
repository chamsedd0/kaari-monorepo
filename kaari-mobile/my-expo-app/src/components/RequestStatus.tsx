import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Platform } from 'react-native';
import { VText } from './typography';
import { colors } from '../theme/colors';

type Variant = 'white' | 'purple';

export type RequestStatusProps = {
  variant?: Variant;
  status: string;
  description: string;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function RequestStatus({ variant = 'white', status, description, style, testID }: RequestStatusProps) {
  const radius = 16;
  // Simulated glass (like timer) to avoid halo/pixelation; subtle border for definition
  const containerBg: ViewStyle =
    variant === 'purple'
      ? { backgroundColor: 'rgba(98,24,168,0.15)' }
      : { backgroundColor: 'rgba(255,255,255,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' };

  const titleColor = variant === 'purple' ? colors.primary : colors.white;
  const descColor = variant === 'purple' ? colors.primary : colors.white;

  return (
    <View
      testID={testID}
      className="px-6 py-4 items-center justify-center"
      // eslint-disable-next-line react-native/no-inline-styles
      style={[{ borderRadius: radius, overflow: 'hidden' }, containerBg, style as any]}
    >
      <VText
        className="text-[20px] leading-[24px] text-center"
        weight="bold"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ color: titleColor, maxWidth: '100%' }}
      >
        {status}
      </VText>
      <VText
        className="mt-1 text-[12px] leading-[16px] text-center"
        weight="medium"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ color: descColor, maxWidth: '100%' }}
      >
        {description}
      </VText>
    </View>
  );
}

export default { RequestStatus };


