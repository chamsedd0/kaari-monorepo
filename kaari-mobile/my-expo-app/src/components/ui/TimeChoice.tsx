import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  times: string[];
  value?: string;
  onChange?: (value: string) => void;
};

export function TimeChoice({ times, value, onChange }: Props) {
  const [internal, setInternal] = useState(times[0]);
  const selected = value ?? internal;
  const setSelected = (v: string) => {
    setInternal(v);
    onChange?.(v);
  };
  return (
    <View className="flex-row flex-wrap gap-2">
      {times.map((t) => {
        const active = t === selected;
        return (
          <Pressable key={t} onPress={() => setSelected(t)} className={`px-3 py-2 rounded-2xl ${active ? 'bg-primary' : 'bg-gray100'}`}>
            <Text className={`${active ? 'text-white' : 'text-black'} font-medium`}>{t}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}


