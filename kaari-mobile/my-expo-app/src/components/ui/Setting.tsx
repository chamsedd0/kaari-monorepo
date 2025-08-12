import { View, Text } from 'react-native';

export function Setting({ label, value }: { label: string; value?: string }) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <Text className="text-gray700">{label}</Text>
      {value ? <Text className="text-black font-semibold">{value}</Text> : null}
    </View>
  );
}


