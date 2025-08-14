import React from 'react';
import { View } from 'react-native';
import { VText } from '../../../src/components/typography';
import { colors } from '../../../src/theme/colors';

export default function ClientDashboard() {
  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.white }}>
      <VText className="text-[24px]" weight="bold">Client Dashboard</VText>
    </View>
  );
}


