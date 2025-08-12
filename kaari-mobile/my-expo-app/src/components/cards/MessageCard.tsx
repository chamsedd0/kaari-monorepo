import { View, Text } from 'react-native';

type Props = { name: string; message: string; time: string; unread?: boolean };

export function MessageCard({ name, message, time, unread }: Props) {
  return (
    <View className="flex-row items-center gap-3 p-4 border-b border-gray-100 bg-white">
      <View className="w-10 h-10 rounded-full bg-gray-200" />
      <View className="flex-1">
        <Text className="font-semibold">{name}</Text>
        <Text className="text-gray-600" numberOfLines={1}>{message}</Text>
      </View>
      <View className="items-end">
        <Text className="text-xs text-gray-500">{time}</Text>
        {unread ? <View className="w-2 h-2 rounded-full bg-black mt-1" /> : null}
      </View>
    </View>
  );
}


