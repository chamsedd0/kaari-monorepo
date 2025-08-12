import { View, Text } from 'react-native';
import { Counter } from './Counter';

export function AmountOfPeople({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4">
      <Text className="text-black font-semibold mb-2">Amount of people</Text>
      <Counter value={value} onChange={onChange} />
    </View>
  );
}


