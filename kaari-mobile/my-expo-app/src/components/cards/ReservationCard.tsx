import { View, Text } from 'react-native';
import { StatusTag, StatusKind } from '../ui/StatusTag';

type Props = { title: string; status: StatusKind; date: string; people: number };

export function ReservationCard({ title, status, date, people }: Props) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 gap-2 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-black">{title}</Text>
        <StatusTag status={status} />
      </View>
      <Text className="text-gray500">Move-in: {date}</Text>
      <Text className="text-gray500">People: {people}</Text>
    </View>
  );
}


