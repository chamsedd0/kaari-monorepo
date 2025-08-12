import { Text, View } from 'react-native';

export type StatusKind =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'paid'
  | 'movedIn'
  | 'warning'
  | 'info';

export function StatusTag({ status }: { status: StatusKind }) {
  const styles: Record<StatusKind, string> = {
    pending: 'bg-warning/10 text-warning',
    accepted: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger',
    paid: 'bg-primaryTint1 text-primaryDark',
    movedIn: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };
  const label: Record<StatusKind, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    paid: 'Paid',
    movedIn: 'Moved in',
    warning: 'Warning',
    info: 'Info',
  };
  return (
    <View className={`px-2 py-1 rounded-full self-start ${styles[status]}`}>
      <Text className="text-[10px] font-semibold uppercase">{label[status]}</Text>
    </View>
  );
}


