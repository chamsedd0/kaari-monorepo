import { Tabs } from 'expo-router';
import { Icon } from '../ui/Icon';

export function TenantBottomNav() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="tenant/index" options={{ title: 'Explore', tabBarIcon: ({ color }: { color: string }) => (<Icon name="search" width={22} height={22} fill={color} />) }} />
      <Tabs.Screen name="tenant/requests" options={{ title: 'Requests', tabBarIcon: ({ color }: { color: string }) => (<Icon name="reservation" width={22} height={22} fill={color} />) }} />
      <Tabs.Screen name="tenant/messages" options={{ title: 'Messages', tabBarIcon: ({ color }: { color: string }) => (<Icon name="messages" width={22} height={22} fill={color} />) }} />
      <Tabs.Screen name="tenant/profile" options={{ title: 'Profile', tabBarIcon: ({ color }: { color: string }) => (<Icon name="profile" width={22} height={22} fill={color} />) }} />
    </Tabs>
  );
}


