import { ScrollView, View, Text } from 'react-native';
import { PropertyCard } from '../../../src/components/cards/PropertyCard';

export default function TenantHome() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 gap-4">
        <Text className="text-2xl font-bold">Explore</Text>
        <PropertyCard title="Bright Studio" price="4,500 MAD" badge="broker" />
        <PropertyCard title="Cozy Room" price="3,200 MAD" badge="landlord" />
      </View>
    </ScrollView>
  );
}


