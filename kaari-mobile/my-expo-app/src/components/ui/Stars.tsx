import { View, Text } from 'react-native';

export function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const items = Array.from({ length: 5 }, (_, i) => (i < full ? '★' : i === full && half ? '☆' : '✩'));
  return (
    <View className="flex-row items-center">
      {items.map((s, i) => (
        <Text key={i} className="text-warning text-base mr-1">{s}</Text>
      ))}
    </View>
  );
}


