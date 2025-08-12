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
    <View style={[{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray100, backgroundColor: colors.white }, style]}>
      <View style={{ height: 160, backgroundColor: colors.gray100 }}>
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        <View style={{ position: 'absolute', top: 8, right: 8 }}>
          <LikeButton liked={isLiked} onToggle={toggle} size={36} />
        </View>
      </View>
      <View style={{ padding: 12, gap: 6 }}>
        <Text style={{ color: colors.gray700, fontWeight: '800' }}>{title}</Text>
        <Text style={{ color: colors.gray500 }}>{location}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <Stars rating={rating} />
          <Text style={{ color: colors.primary, fontWeight: '800' }}>{price}</Text>
        </View>
      </View>
    </View>
  );
}


