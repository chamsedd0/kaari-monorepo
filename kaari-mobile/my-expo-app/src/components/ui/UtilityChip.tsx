import { View, Text } from 'react-native';
import { Icon, IconName } from './Icon';

export function UtilityChip({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View className="flex-row items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
      <Icon name={icon} width={16} height={16} />
      <Text className="text-sm">{label}</Text>
    </View>
  );
}


