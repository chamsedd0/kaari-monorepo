import { Image, Pressable, Text, View } from 'react-native';
import { Stars } from '../ui/Stars';

type Props = {
  title: string;
  price: string;
  rating?: number;
  imageUrl?: string;
  badge?: string;
  onPress?: () => void;
};

export function PropertyCard({ title, price, rating = 4.8, imageUrl, badge, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="rounded-2xl overflow-hidden bg-white border border-gray100 shadow-md">
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 168 }} />
      ) : (
        <View className="w-full h-44 bg-gray100" />
      )}
      <View className="p-4 gap-1.5">
        {badge ? (
          <Text className="text-[10px] uppercase bg-primaryTint2 text-primaryDark px-2 py-1 rounded-full self-start">{badge}</Text>
        ) : null}
        <Text className="text-base font-semibold text-black" numberOfLines={1}>{title}</Text>
        <Text className="text-sm text-primary font-semibold">{price}</Text>
        <Stars rating={rating} />
      </View>
    </Pressable>
  );
}


