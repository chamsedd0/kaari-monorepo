import { View } from 'react-native';
import { TenantBottomNav } from '../navigation/TenantBottomNav';

export function NavBar() {
  return (
    <View className="rounded-2xl overflow-hidden">
      <TenantBottomNav />
    </View>
  );
}


