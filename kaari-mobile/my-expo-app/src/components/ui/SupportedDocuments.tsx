import { View, Text } from 'react-native';

export function SupportedDocuments({ items }: { items: string[] }) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 gap-2">
      <Text className="text-black font-semibold mb-2">Supported Documents</Text>
      <View className="gap-1">
        {items.map((it, i) => (
          <Text key={i} className="text-gray700">• {it}</Text>
        ))}
      </View>
    </View>
  );
}


