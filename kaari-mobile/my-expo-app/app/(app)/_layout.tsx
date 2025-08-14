import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="tenant" options={{ title: 'Tenant', tabBarIcon: ({ color }: { color: string }) => (<View className="w-6 h-6 bg-red-500" />) }} />
      <Tabs.Screen name="advertiser" options={{ title: 'Advertiser', tabBarIcon: ({ color }: { color: string }) => (<View className="w-6 h-6 bg-red-500" />) }} />
    </Tabs>
  );
}


