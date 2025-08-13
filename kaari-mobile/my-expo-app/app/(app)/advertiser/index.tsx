import { ScrollView, View, Text } from 'react-native';
import RequestCard from '~/components/cards/RequestCard';

export default function AdvertiserHome() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 gap-4">
        <Text className="text-2xl font-bold">Dashboard</Text>
        <RequestCard name="Jane Smith" status="pending" moveInDate="2025-09-12" people={1} />
        <RequestCard name="Alex" status="paid" moveInDate="2025-09-20" people={2} />
      </View>
    </ScrollView>
  );
}


