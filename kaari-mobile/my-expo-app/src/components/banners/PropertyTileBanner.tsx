import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '~/theme/colors';

export type PropertyTileBannerProps = {
  imageUri: string;
  title: string;
  subtitle?: string;
};

export default function PropertyTileBanner({ imageUri, title, subtitle }: PropertyTileBannerProps) {
  return (
    <View className="rounded-2xl overflow-hidden border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <Image source={{ uri: imageUri }} style={{ width: '100%', height: 120 }} resizeMode="cover" />
      <View className="p-3.5 gap-1.5">
        <Text className="text-gray700 font-extrabold">{title}</Text>
        {!!subtitle && <Text className="text-gray500">{subtitle}</Text>}
      </View>
    </View>
  );
}


