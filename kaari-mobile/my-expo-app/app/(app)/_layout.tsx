import { Tabs } from 'expo-router';
import Icon from '~/components/ui/Icon';

export default function AppTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="tenant" options={{ title: 'Tenant', tabBarIcon: ({ color }: { color: string }) => (<Icon name="property" width={22} height={22} fill={color} />) }} />
      <Tabs.Screen name="advertiser" options={{ title: 'Advertiser', tabBarIcon: ({ color }: { color: string }) => (<Icon name="dashboard" width={22} height={22} fill={color} />) }} />
    </Tabs>
  );
}


