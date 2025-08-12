import { View, TextInput } from 'react-native';
import { Icon } from './Icon';

export function SearchBarItem({ placeholder = 'Search' }: { placeholder?: string }) {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-2xl px-3 py-2">
      <Icon name="search" width={18} height={18} fill="#6B7280" />
      <TextInput className="ml-2 flex-1" placeholder={placeholder} placeholderTextColor="#9CA3AF" />
    </View>
  );
}


