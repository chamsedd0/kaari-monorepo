import { Pressable, Text, View } from 'react-native';

export type RadioOption = { label: string; value: string; description?: string };

export function RadioGroup({ options, value, onChange }: { options: RadioOption[]; value?: string; onChange: (v: string) => void }) {
  return (
    <View className="gap-3">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable key={opt.value} onPress={() => onChange(opt.value)} className="flex-row gap-3 items-center">
            <View className={`w-5 h-5 rounded-full border ${selected ? 'border-black' : 'border-gray-300'} items-center justify-center`}>
              {selected ? <View className="w-2.5 h-2.5 rounded-full bg-black" /> : null}
            </View>
            <View className="flex-1">
              <Text className="font-medium">{opt.label}</Text>
              {opt.description ? <Text className="text-gray-600 text-sm">{opt.description}</Text> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}


