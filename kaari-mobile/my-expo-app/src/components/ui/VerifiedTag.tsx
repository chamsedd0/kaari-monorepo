import { View, Text } from 'react-native';
import { Icon } from './Icon';

export function VerifiedTag() {
  return (
    <View className="flex-row items-center gap-1 bg-green-100 px-2 py-1 rounded-full self-start">
      <Icon name="verified" width={12} height={12} />
      <Text className="text-[10px] text-green-700 font-semibold uppercase">Verified</Text>
    </View>
  );
}


