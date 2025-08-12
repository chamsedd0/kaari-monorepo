import { View, Text } from 'react-native';
import { Icon, IconName } from './Icon';

export function EmptyState({ icon = 'info', title, subtitle }: { icon?: IconName; title: string; subtitle?: string }) {
  return (
    <View className="items-center justify-center p-8">
      <Icon name={icon} width={40} height={40} fill="#9CA3AF" />
      <Text className="text-lg font-semibold mt-3 text-center">{title}</Text>
      {subtitle ? <Text className="text-gray-600 text-center mt-1">{subtitle}</Text> : null}
    </View>
  );
}


