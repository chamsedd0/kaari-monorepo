import { View, Text } from 'react-native';

type Row = { label: string; value: string; tone?: 'muted' | 'bold' };

export function PriceBreakdown({ rows, total }: { rows: Row[]; total: string }) {
  return (
    <View className="rounded-2xl border border-gray-100 bg-white p-4">
      {rows.map((r, i) => (
        <View key={i} className="flex-row items-center justify-between py-1">
          <Text className={`${r.tone === 'muted' ? 'text-gray-600' : ''}`}>{r.label}</Text>
          <Text style={{ fontFamily: r.tone === 'bold' ? 'VisbyCF-DemiBold' : 'VisbyCF' }}>{r.value}</Text>
        </View>
      ))}
      <View className="h-px bg-gray-100 my-2" />
      <View className="flex-row items-center justify-between">
        <Text style={{ fontFamily: 'VisbyCF-DemiBold' }}>Total</Text>
        <Text style={{ fontFamily: 'VisbyCF-Heavy' }}>{total}</Text>
      </View>
    </View>
  );
}


