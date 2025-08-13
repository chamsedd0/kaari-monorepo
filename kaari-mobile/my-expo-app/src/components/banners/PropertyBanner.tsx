import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '~/theme/colors';
import SectionBadge from '~/components/badge/SectionBadge';

export type PropertyBannerProps = {
  imageUri: string;
  title: string;
  subtitle?: string;
  badge?: string;
};

export default function PropertyBanner({ imageUri, title, subtitle, badge }: PropertyBannerProps) {
  return (
    <View className="rounded-2xl overflow-hidden">
      <View style={{ height: 140, backgroundColor: colors.gray100 }}>
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      </View>
      <View className="p-3.5 gap-1.5 bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray700 font-extrabold">{title}</Text>
          {!!badge && <SectionBadge text={badge} />}
        </View>
        {!!subtitle && <Text className="text-gray500">{subtitle}</Text>}
      </View>
    </View>
  );
}


