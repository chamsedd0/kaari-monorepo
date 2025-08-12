import { View, Text } from 'react-native';
import { ProgressBar } from '../ui/ProgressBar';

export function PerformanceCard({ title, value, progress }: { title: string; value: string; progress?: number }) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 gap-2 shadow-sm">
      <Text style={{ fontFamily: 'VisbyCF' }} className="text-gray500 text-sm">{title}</Text>
      <Text style={{ fontFamily: 'VisbyCF-Bold' }} className="text-2xl text-black">{value}</Text>
      {typeof progress === 'number' ? <ProgressBar value={progress} /> : null}
    </View>
  );
}


