import React from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';
import { colors } from '~/theme/colors';
import LikeButton from '../buttons/LikeButton';
import Stars from '../primitives/Stars';

export type PropertyCardTenantProps = {
  imageUri: string;
  title: string;
  location: string;
  price: string;
  rating?: number;
  liked?: boolean;
  onToggleLike?: (liked: boolean) => void;
  style?: ViewStyle | ViewStyle[];
};

export default function PropertyCardTenant({ imageUri, title, location, price, rating = 0, liked = false, onToggleLike, style }: PropertyCardTenantProps) {
  const [isLiked, setIsLiked] = React.useState(liked);
  const toggle = (v: boolean) => {
    setIsLiked(v);
    onToggleLike?.(v);
  };
  return (
    <View className="rounded-2xl overflow-hidden" style={[{ borderWidth: 1, borderColor: colors.gray100, backgroundColor: colors.white }, style]}>
      <View style={{ height: 160, backgroundColor: colors.gray100 }}>
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        <View className="absolute top-2 right-2">
          <LikeButton liked={isLiked} onToggle={toggle} size={36} />
        </View>
      </View>
      <View className="p-3 gap-1.5">
        <Text style={{ color: colors.gray700, fontWeight: '800' }}>{title}</Text>
        <Text style={{ color: colors.gray500 }}>{location}</Text>
        <View className="flex-row items-center justify-between mt-1">
          <Stars rating={rating} />
          <Text style={{ color: colors.primary, fontWeight: '800' }}>{price}</Text>
        </View>
      </View>
    </View>
  );
}


