import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Option = { label: string; value: string };

type Props = {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
};

export function RadialSelector({ options, value, onChange }: Props) {
  const [internal, setInternal] = useState(options[0]?.value);
  const selected = value ?? internal;
  const setSelected = (v: string) => {
    setInternal(v);
    onChange?.(v);
  };

  return (
    <View className="flex-row flex-wrap gap-3">
      {options.map((opt) => {
        const active = opt.value === selected;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setSelected(opt.value)}
            className={`px-4 py-2 rounded-full relative ${active ? 'bg-primaryTint2' : 'bg-gray100'}`}
          >
            {active ? (
              <View className="absolute inset-0 rounded-full border-2 border-primary" />
            ) : null}
            <Text className={`${active ? 'text-primaryDark' : 'text-black'} font-medium`}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}


