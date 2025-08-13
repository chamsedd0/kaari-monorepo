import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import CloseButton from '~/components/buttons/CloseButton';

export type PropertyScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onClose?: () => void;
};

export default function PropertyScreenHeader({ title, subtitle, onClose }: PropertyScreenHeaderProps) {
  return (
    <View className="px-4 py-3" style={{ backgroundColor: colors.white }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray700 font-extrabold text-xl">{title}</Text>
        <CloseButton onPress={onClose} />
      </View>
      {!!subtitle && <Text className="text-gray500 mt-0.5">{subtitle}</Text>}
    </View>
  );
}


