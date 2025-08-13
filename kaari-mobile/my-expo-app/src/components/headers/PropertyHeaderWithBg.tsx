import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '~/theme/colors';

export type PropertyHeaderWithBgProps = {
  title: string;
  subtitle?: string;
  backgroundUri: string;
};

export default function PropertyHeaderWithBg({ title, subtitle, backgroundUri }: PropertyHeaderWithBgProps) {
  return (
    <View>
      <Image source={{ uri: backgroundUri }} style={{ width: '100%', height: 140 }} resizeMode="cover" />
      <View className="px-4 py-3" style={{ backgroundColor: colors.white }}>
        <Text className="text-gray700 font-extrabold text-xl">{title}</Text>
        {!!subtitle && <Text className="text-gray500 mt-0.5">{subtitle}</Text>}
      </View>
    </View>
  );
}


