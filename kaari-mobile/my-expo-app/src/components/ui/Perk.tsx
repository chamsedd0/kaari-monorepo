import { View, Text } from 'react-native';
import { Icon } from './Icon';

export function Perk({ label, icon = 'check' }: { label: string; icon?: any }) {
  return (
    <View className="flex-row items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
      <Icon name={icon} width={16} height={16} />
      <Text className="text-sm">{label}</Text>
    </View>
  );
}


