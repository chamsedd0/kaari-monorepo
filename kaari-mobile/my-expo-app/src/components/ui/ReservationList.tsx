import { View } from 'react-native';
import { ReservationCard } from '../cards/ReservationCard';

type Item = Parameters<typeof ReservationCard>[0];

export function ReservationList({ items }: { items: Item[] }) {
  return (
    <View className="gap-3">
      {items.map((it, idx) => (
        <ReservationCard key={idx} {...it} />
      ))}
    </View>
  );
}


