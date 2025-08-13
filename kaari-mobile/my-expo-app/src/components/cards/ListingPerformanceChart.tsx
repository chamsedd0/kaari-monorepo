import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type ListingPerformanceChartProps = {
  title?: string;
  series?: number[]; // values 0..1
  labels?: string[];
};

export default function ListingPerformanceChart({ title = 'Listing performance', series = [0.2, 0.6, 0.4, 0.8, 0.3], labels = ['M', 'T', 'W', 'T', 'F'] }: ListingPerformanceChartProps) {
  return (
    <View className="rounded-2xl p-3.5 gap-3 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <Text style={{ color: colors.gray700, fontWeight: '800' }}>{title}</Text>
      <View className="flex-row items-end justify-between h-28">
        {series.map((v, i) => (
          <View key={i} className="items-center" style={{ width: 16 }}>
            <View style={{ width: 12, height: Math.max(6, v * 96), borderRadius: 6, backgroundColor: colors.primary }} />
            <Text className="text-xs mt-1" style={{ color: colors.gray500 }}>{labels[i] ?? ''}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}


