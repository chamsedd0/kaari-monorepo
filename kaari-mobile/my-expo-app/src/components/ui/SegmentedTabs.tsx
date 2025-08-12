import { View, Text, Pressable } from 'react-native';

type Tab = { key: string; label: string };

export function SegmentedTabs({ tabs, value, onChange }: { tabs: Tab[]; value: string; onChange: (key: string) => void }) {
  return (
    <View className="flex-row bg-gray-100 rounded-2xl p-1">
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <Pressable key={t.key} onPress={() => onChange(t.key)} className={`flex-1 px-3 py-2 rounded-2xl items-center ${active ? 'bg-white' : ''}`}>
            <Text className={`text-sm ${active ? 'font-semibold' : 'text-gray-600'}`}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}


