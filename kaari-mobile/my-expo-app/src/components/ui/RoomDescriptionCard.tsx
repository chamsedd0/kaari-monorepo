import { View, Text } from 'react-native';

export function RoomDescriptionCard({ title, description }: { title: string; description: string }) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 gap-2">
      <Text className="text-black font-semibold">{title}</Text>
      <Text className="text-gray700">{description}</Text>
    </View>
  );
}


