import { View, Text, Pressable } from 'react-native';

export function Counter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View className="flex-row items-center gap-3">
      <Pressable className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center" onPress={() => onChange(Math.max(0, value - 1))}>
        <Text className="text-lg">-</Text>
      </Pressable>
      <Text className="text-lg font-semibold w-8 text-center">{value}</Text>
      <Pressable className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center" onPress={() => onChange(value + 1)}>
        <Text className="text-lg">+</Text>
      </Pressable>
    </View>
  );
}


