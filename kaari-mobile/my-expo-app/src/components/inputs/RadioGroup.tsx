import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type RadioOption = { label: string; value: string };

export type RadioGroupProps = {
  options: RadioOption[];
  value: string;
  onChange: (v: string) => void;
};

export default function RadioGroup({ options, value, onChange }: RadioGroupProps) {
  return (
    <View className="gap-2.5">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <View key={opt.value} className="flex-row items-center">
            <View
              onTouchEnd={() => onChange(opt.value)}
              className="items-center justify-center mr-2.5"
              style={{
                width: 22,
                height: 22,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: selected ? colors.primary : colors.gray300,
              }}
            >
              {selected && <View className="" style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: colors.primary }} />}
            </View>
            <Text style={{ color: colors.gray700 }}>{opt.label}</Text>
          </View>
        );
      })}
    </View>
  );
}


