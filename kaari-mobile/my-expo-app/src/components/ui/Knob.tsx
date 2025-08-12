import { View, Text } from 'react-native';

export function Knob({ value, label }: { value: number; label?: string }) {
  return (
    <View className="items-center">
      <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center">
        <Text className="text-2xl font-bold">{value}</Text>
      </View>
      {label ? <Text className="text-gray-600 mt-1">{label}</Text> : null}
    </View>
  );
}


