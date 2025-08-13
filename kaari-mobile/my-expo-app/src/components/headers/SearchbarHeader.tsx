import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import SearchBar from '~/components/inputs/SearchBar';

export type SearchbarHeaderProps = {
  placeholder?: string;
  value: string;
  onChangeText: (t: string) => void;
};

export default function SearchbarHeader({ placeholder = 'Search', value, onChangeText }: SearchbarHeaderProps) {
  return (
    <View className="px-4 py-3 gap-2" style={{ backgroundColor: colors.white }}>
      <Text className="text-gray700 font-extrabold text-xl">Explore</Text>
      <SearchBar value={value} onChangeText={onChangeText} placeholder={placeholder} />
    </View>
  );
}


