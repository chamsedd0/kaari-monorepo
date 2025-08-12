import { View } from 'react-native';
import { PropertyCard } from '../cards/PropertyCard';

type Item = Parameters<typeof PropertyCard>[0];

export function PropertiesGrid({ items }: { items: Item[] }) {
  return (
    <View className="flex-row flex-wrap justify-between">
      {items.map((it, idx) => (
        <View key={idx} style={{ width: '48%', marginBottom: 12 }}>
          <PropertyCard {...it} />
        </View>
      ))}
    </View>
  );
}


