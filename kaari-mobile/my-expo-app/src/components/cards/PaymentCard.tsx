import { View, Text } from 'react-native';
import { StatusTag, StatusKind } from '../ui/StatusTag';

type Props = { amount: string; date: string; status: StatusKind };

export function PaymentCard({ amount, date, status }: Props) {
  const statusMap: Record<Props['status'], StatusKind> = {
    pending: 'pending',
    accepted: 'accepted',
    rejected: 'rejected',
    paid: 'paid',
    movedIn: 'movedIn',
    warning: 'warning',
    info: 'info',
  };
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 gap-2 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-black">{amount}</Text>
        <StatusTag status={statusMap[status]} />
      </View>
      <Text className="text-gray500">{date}</Text>
    </View>
  );
}


