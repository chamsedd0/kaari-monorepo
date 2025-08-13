import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type DashboardHeaderAdvertiserProps = {
  title?: string;
  subtitle?: string;
};

export default function DashboardHeaderAdvertiser({ title = 'Dashboard', subtitle }: DashboardHeaderAdvertiserProps) {
  return (
    <View className="px-4 py-3" style={{ backgroundColor: colors.white }}>
      <Text className="text-gray700 font-extrabold text-xl">{title}</Text>
      {!!subtitle && <Text className="text-gray500 mt-0.5">{subtitle}</Text>}
    </View>
  );
}


