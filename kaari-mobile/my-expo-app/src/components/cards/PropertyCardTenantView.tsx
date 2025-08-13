import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '~/theme/colors';
import Stars from '~/components/primitives/Stars';

export type PropertyCardTenantViewProps = {
  imageUri: string;
  title: string;
  location: string;
  price: string;
  rating: number;
  details?: string;
};

export default function PropertyCardTenantView({ imageUri, title, location, price, rating, details }: PropertyCardTenantViewProps) {
  return (
    <View className="rounded-2xl overflow-hidden border" style={{ borderColor: colors.gray100, backgroundColor: colors.white }}>
      <Image source={{ uri: imageUri }} style={{ width: '100%', height: 160 }} resizeMode="cover" />
      <View className="p-3 gap-1.5">
        <Text className="text-gray700 font-extrabold">{title}</Text>
        <Text className="text-gray500">{location}</Text>
        {!!details && <Text className="text-gray500">{details}</Text>}
        <View className="flex-row items-center justify-between mt-1">
          <Stars rating={rating} />
          <Text className="text-primary font-extrabold">{price}</Text>
        </View>
      </View>
    </View>
  );
}


