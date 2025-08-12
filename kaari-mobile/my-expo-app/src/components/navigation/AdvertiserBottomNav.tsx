import { Tabs } from 'expo-router';
import { Icon } from '../ui/Icon';

export function AdvertiserBottomNav() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="advertiser/index" options={{ title: 'Dashboard', tabBarIcon: ({ color }: { color: string }) => (<Icon name="dashboard" width={22} height={22} fill={color} />) }} />
      <Tabs.Screen name="advertiser/listings" options={{ title: 'Listings', tabBarIcon: ({ color }: { color: string }) => (<Icon name="property" width={22} height={22} fill={color} />) }} />
      <Tabs.Screen name="advertiser/requests" options={{ title: 'Requests', tabBarIcon: ({ color }: { color: string }) => (<Icon name="reservation" width={22} height={22} fill={color} />) }} />
      <Tabs.Screen name="advertiser/payments" options={{ title: 'Payments', tabBarIcon: ({ color }: { color: string }) => (<Icon name="payments" width={22} height={22} fill={color} />) }} />
    </Tabs>
  );
}


