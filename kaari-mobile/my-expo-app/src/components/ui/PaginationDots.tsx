import { View } from 'react-native';

export function PaginationDots({ index, total }: { index: number; total: number }) {
  return (
    <View className="flex-row gap-1">
      {Array.from({ length: total }, (_, i) => (
        <View key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-black' : 'bg-gray-300'}`} />
      ))}
    </View>
  );
}


