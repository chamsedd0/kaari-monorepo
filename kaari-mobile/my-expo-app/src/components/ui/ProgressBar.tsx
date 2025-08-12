import { View } from 'react-native';

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View className="w-full h-2 bg-gray100 rounded-full overflow-hidden">
      <View style={{ width: `${pct}%` }} className="h-2 bg-primary" />
    </View>
  );
}


