import { View, Text } from 'react-native';
import { UtilityChip } from './UtilityChip';

export function PropertyUtility({ icon, label }: { icon: Parameters<typeof UtilityChip>[0]['icon']; label: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <UtilityChip icon={icon} label={label} />
    </View>
  );
}


