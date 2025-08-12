import { View, Text } from 'react-native';
import { TenantBottomNav } from '../navigation/TenantBottomNav';
import { AdvertiserBottomNav } from '../navigation/AdvertiserBottomNav';

export function NavBarPreview() {
  return (
    <View className="rounded-2xl overflow-hidden border border-gray100">
      <View className="p-3">
        <Text className="text-black font-semibold mb-2">Tenant Nav Bar</Text>
      </View>
      <TenantBottomNav />
      <View className="p-3">
        <Text className="text-black font-semibold mb-2">Advertiser Nav Bar</Text>
      </View>
      <AdvertiserBottomNav />
    </View>
  );
}


