import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <Text className="text-2xl font-bold">Kaari</Text>
      <Link href="/components" className="text-blue-600 mt-4">Open component gallery</Link>
      <Link href="/(app)" className="text-blue-600 mt-2">Open app tabs</Link>
    </View>
  );
}


