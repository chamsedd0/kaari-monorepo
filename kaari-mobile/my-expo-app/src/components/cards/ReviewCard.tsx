import { View, Text } from 'react-native';
import { Stars } from '../ui/Stars';

type Props = { author: string; rating: number; content: string; date: string };

export function ReviewCard({ author, rating, content, date }: Props) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 gap-2 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-black">{author}</Text>
        <Stars rating={rating} />
      </View>
      <Text className="text-gray700">{content}</Text>
      <Text className="text-gray500 text-xs">{date}</Text>
    </View>
  );
}


