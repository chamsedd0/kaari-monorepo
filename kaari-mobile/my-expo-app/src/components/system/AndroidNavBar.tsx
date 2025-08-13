import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import Icon from '~/components/ui/Icon';

export type AndroidNavBarProps = {
  title: string;
  onBack?: () => void;
};

export default function AndroidNavBar({ title, onBack }: AndroidNavBarProps) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-3" style={{ backgroundColor: colors.white }}>
      <View onTouchEnd={onBack} className="w-6 h-6 items-center justify-center">
        <Icon name="property" width={20} height={20} fill={colors.gray700} />
      </View>
      <Text className="text-gray700 font-extrabold text-lg">{title}</Text>
    </View>
  );
}


