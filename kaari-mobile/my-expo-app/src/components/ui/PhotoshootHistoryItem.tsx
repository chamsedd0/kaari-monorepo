import { View, Text } from 'react-native';
import { SectionBadge } from './SectionBadge';
import { StatusTag, StatusKind } from './StatusTag';

export function PhotoshootHistoryItem({ title, date, status }: { title: string; date: string; status: StatusKind }) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 relative">
      <SectionBadge label="Photoshoot" color="primary" />
      <Text className="text-black font-semibold mt-2">{title}</Text>
      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-gray500">{date}</Text>
        <StatusTag status={status} />
      </View>
    </View>
  );
}


