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
    <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 100, paddingHorizontal: 16, backgroundColor: colors.gray100 }}>
      {!!left && <View style={{ marginRight: 8 }}>{left}</View>}
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.gray300} style={{ flex: 1, paddingVertical: 10, color: colors.gray700 }} />
      {!!right && <View style={{ marginLeft: 8 }}>{right}</View>}
    </View>
  );
}


