import { View, Text } from 'react-native';

export function ProfileNavBar({ name, email }: { name: string; email: string }) {
  return (
    <View className="flex-row items-center gap-3 p-4 bg-white border-b border-gray-100">
      <View className="w-12 h-12 rounded-full bg-gray-200" />
      <View>
        <Text className="font-semibold">{name}</Text>
        <Text className="text-gray-600 text-sm">{email}</Text>
      </View>
    </View>
  );
}


