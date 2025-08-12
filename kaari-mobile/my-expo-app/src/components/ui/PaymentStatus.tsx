import { View, Text } from 'react-native';
import { StatusTag, StatusKind } from './StatusTag';

export function PaymentStatus({ label, status }: { label: string; status: StatusKind }) {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-black font-semibold">{label}</Text>
      <StatusTag status={status} />
    </View>
  );
}


