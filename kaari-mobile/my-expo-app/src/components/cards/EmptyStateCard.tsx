import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type EmptyStateCardProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  illustration?: React.ReactNode;
};

export default function EmptyStateCard({ title, subtitle, action, illustration }: EmptyStateCardProps) {
  return (
    <View className="rounded-2xl p-4 items-center gap-3 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      {!!illustration && <View className="mb-1">{illustration}</View>}
      <Text className="text-gray700 font-extrabold text-base text-center">{title}</Text>
      {!!subtitle && <Text className="text-gray500 text-center">{subtitle}</Text>}
      {!!action && <View className="mt-1.5">{action}</View>}
    </View>
  );
}


