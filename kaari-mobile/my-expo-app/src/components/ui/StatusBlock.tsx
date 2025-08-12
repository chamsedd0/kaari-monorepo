import { View, Text } from 'react-native';
import { Icon, IconName } from './Icon';

export function StatusBlock({ icon = 'check', title, subtitle }: { icon?: IconName; title: string; subtitle?: string }) {
  return (
    <View className="items-center gap-2 p-6 rounded-2xl bg-gray-50 border border-gray-100">
      <Icon name={icon} width={32} height={32} />
      <Text className="text-lg font-semibold text-center">{title}</Text>
      {subtitle ? <Text className="text-gray-600 text-center">{subtitle}</Text> : null}
    </View>
  );
}


