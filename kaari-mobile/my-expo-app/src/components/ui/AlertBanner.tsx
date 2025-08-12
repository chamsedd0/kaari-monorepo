import { View, Text } from 'react-native';
import { Icon, IconName } from './Icon';

type Kind = 'info' | 'success' | 'warning' | 'danger';

export function AlertBanner({ kind = 'info', title, message }: { kind?: Kind; title: string; message?: string }) {
  const map: Record<Kind, { icon: IconName; cls: string; iconColor: string }> = {
    info: { icon: 'info', cls: 'bg-blue-50 border-blue-200', iconColor: '#2563EB' },
    success: { icon: 'check', cls: 'bg-green-50 border-green-200', iconColor: '#16A34A' },
    warning: { icon: 'alert', cls: 'bg-amber-50 border-amber-200', iconColor: '#D97706' },
    danger: { icon: 'close', cls: 'bg-red-50 border-red-200', iconColor: '#DC2626' },
  };
  const cfg = map[kind];
  return (
    <View className={`flex-row gap-3 p-3 rounded-2xl border ${cfg.cls}`}>
      <Icon name={cfg.icon} width={20} height={20} />
      <View className="flex-1">
        <Text className="font-semibold">{title}</Text>
        {message ? <Text className="text-gray-700 mt-1">{message}</Text> : null}
      </View>
    </View>
  );
}


