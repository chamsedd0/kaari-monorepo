import React from 'react';
import { TextInput, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import SearchIcon from '../../assets/Icon_Search.svg';

export type SearchBarProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
  onSubmitEditing?: () => void;
};

export function SearchBar({ value, onChangeText, placeholder = 'Start Search', style, testID, onSubmitEditing }: SearchBarProps) {
  const glow: ViewStyle = {
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  };

  return (
    <View
      testID={testID}
      className="flex-row items-center rounded-[100px] bg-white"
      style={[{ paddingVertical: 6, paddingHorizontal: 20 }, glow, style as any]}
    >
      <SearchIcon width={20} height={20} color={colors.primary} fill={colors.primary} stroke={colors.primary}/>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.primaryLight}
        onSubmitEditing={onSubmitEditing}
        className="flex-1 ml-2 text-[16px] leading-[22px]"
        style={{ fontFamily: 'VisbyCF', color: colors.gray700 }}
      />
    </View>
  );
}

export default { SearchBar };


