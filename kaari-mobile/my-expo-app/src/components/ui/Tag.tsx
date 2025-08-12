import { Text, View } from 'react-native';

type Props = { label: string; tone?: 'default' | 'success' | 'warning' | 'danger'; };

export function Tag({ label, tone = 'default' }: Props) {
  const toneCls = {
    default: 'bg-gray100 text-gray700',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  }[tone];
  return (
    <View className={`px-2 py-1 rounded-full self-start ${toneCls}`}>
      <Text className="text-xs font-semibold">{label}</Text>
    </View>
  );
}


