import { Text, View } from 'react-native';
import { StatusTag, StatusKind } from '../ui/StatusTag';

type Props = {
  name: string;
  status: StatusKind;
  moveInDate: string;
  people: number;
};

export function RequestCard({ name, status, moveInDate, people }: Props) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 gap-2 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-black">{name}</Text>
        <StatusTag status={status} />
      </View>
      <Text className="text-gray500">Move-in: {moveInDate}</Text>
      <Text className="text-gray500">People: {people}</Text>
    </View>
  );
}


