import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type AdvertiserHeader3Props = {
  title?: string;
  subtitle?: string;
};

export default function AdvertiserHeader3({ title = 'Advertiser', subtitle }: AdvertiserHeader3Props) {
  return (
    <View className="px-4 py-3 gap-1.5" style={{ backgroundColor: colors.white }}>
      <Text className="text-gray700 font-extrabold text-xl">{title}</Text>
      {!!subtitle && <Text className="text-gray500">{subtitle}</Text>}
    </View>
  );
}


