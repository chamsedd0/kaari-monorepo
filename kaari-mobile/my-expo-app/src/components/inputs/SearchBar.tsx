import React from 'react';
import { View, TextInput } from 'react-native';
import { colors } from '~/theme/colors';

export type SearchBarProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function SearchBar({ value, onChangeText, placeholder = 'Search', left, right }: SearchBarProps) {
  return (
    <View className="flex-row items-center rounded-[100px] px-4" style={{ backgroundColor: colors.gray100 }}>
      {!!left && <View className="mr-2">{left}</View>}
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.gray300} style={{ flex: 1, paddingVertical: 10, color: colors.gray700 }} />
      {!!right && <View className="ml-2">{right}</View>}
    </View>
  );
}


