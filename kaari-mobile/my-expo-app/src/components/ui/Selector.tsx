import { View, Text, Pressable } from 'react-native';

type Option = { label: string; value: string };

export function Selector({ options, value, onChange }: { options: Option[]; value?: string; onChange: (v: string) => void }) {
  return (
    <View className="flex-row gap-2 flex-wrap">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable key={opt.value} onPress={() => onChange(opt.value)} className={`px-3 py-2 rounded-full border ${selected ? 'bg-black border-black' : 'bg-white border-gray-200'}`}>
            <Text className={`${selected ? 'text-white' : 'text-black'} text-sm`}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}


