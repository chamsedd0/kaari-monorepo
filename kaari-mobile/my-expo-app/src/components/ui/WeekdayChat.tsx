import { View, Text } from 'react-native';

export function WeekdayChat({ weekday, time }: { weekday: string; time: string }) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 flex-row items-center justify-between">
      <Text className="text-black font-semibold">{weekday}</Text>
      <Text className="text-gray700">{time}</Text>
    </View>
  );
}


