import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import CloseButton from '~/components/buttons/CloseButton';

export type ApplicationHeaderProps = {
  title: string;
  subtitle?: string;
  onClose?: () => void;
};

export default function ApplicationHeader({ title, subtitle, onClose }: ApplicationHeaderProps) {
  return (
    <View className="px-4 pt-4 pb-3 gap-2" style={{ backgroundColor: colors.white }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray700 font-extrabold text-xl">{title}</Text>
        <CloseButton onPress={onClose} />
      </View>
      {!!subtitle && <Text className="text-gray500">{subtitle}</Text>}
    </View>
  );
}


