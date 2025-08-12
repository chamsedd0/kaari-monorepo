import { View, Text } from 'react-native';
import { Icon } from './Icon';

export function TenantProtectionBanner() {
  return (
    <View className="flex-row items-center gap-3 p-3 rounded-2xl bg-purple-50 border border-purple-200">
      <Icon name="verified" width={20} height={20} />
      <View className="flex-1">
        <Text className="font-semibold">Tenant Protection</Text>
        <Text className="text-gray-700">Your payment is held until 24h after move-in.</Text>
      </View>
    </View>
  );
}


