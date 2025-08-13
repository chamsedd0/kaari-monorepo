import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { colors } from '~/theme/colors';
import Svg, { Path, Circle } from 'react-native-svg';

export type ListingPerformanceChartProps = {
  title?: string;
  period?: string;
  views?: number;
  clicks?: number;
  bookings?: number;
  points?: { purple: number[]; blue: number[]; green: number[] };
};

export default function ListingPerformanceChart({
  title = 'Listing Performance',
  period = 'April 2025',
  views = 50,
  clicks = 120,
  bookings = 85,
  points = {
    purple: [0.15, 0.5, 0.42, 0.55, 0.78, 0.92],
    blue: [0.28, 0.22, 0.35, 0.6, 0.72, 0.82],
    green: [0.08, 0.58, 0.24, 0.46, 0.36, 0.76],
  },
}: ListingPerformanceChartProps) {
  const { width } = useWindowDimensions();
  const chartPadding = 16;
  const chartHeight = 120;
  const chartWidth = width - chartPadding * 2 - 32; // account for card padding

  function buildPath(values: number[], color: string, fillOpacity = 0.2) {
    const n = values.length;
    const stepX = chartWidth / (n - 1);
    const y = (v: number) => chartHeight - v * chartHeight;
    let d = '';
    values.forEach((v, i) => {
      const px = i * stepX;
      const py = y(v);
      if (i === 0) {
        d += `M ${px} ${py}`;
      } else {
        const cx = px - stepX / 2;
        const cy = y(values[i - 1]);
        d += ` C ${cx} ${cy} ${cx} ${py} ${px} ${py}`;
      }
    });
    // area fill to bottom
    const lastX = (n - 1) * stepX;
    d += ` L ${lastX} ${chartHeight} L 0 ${chartHeight} Z`;
    return { d, color, fillOpacity };
  }

  const purplePath = buildPath(points.purple, colors.primary, 0.25);
  const bluePath = buildPath(points.blue, colors.info, 0.25);
  const greenPath = buildPath(points.green, colors.success, 0.25);

  const lastX = (points.purple.length - 1) * (chartWidth / (points.purple.length - 1));
  const lastPurpleY = chartHeight - points.purple[points.purple.length - 1] * chartHeight;
  const lastBlueY = chartHeight - points.blue[points.blue.length - 1] * chartHeight;
  const lastGreenY = chartHeight - points.green[points.green.length - 1] * chartHeight;

  return (
    <View className="rounded-2xl border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <View className="p-4 pb-3">
        <Text className="text-gray700 font-extrabold text-lg">{title}</Text>
        <Text className="text-gray500 mt-0.5">{period}</Text>
        <View className="flex-row justify-between mt-3 mb-2">
          <Metric value={views} label="Views" color={colors.primary} />
          <Metric value={clicks} label="Clicks" color={colors.info} />
          <Metric value={bookings} label="Bookings" color={colors.success} />
        </View>
      </View>
      <View style={{ paddingHorizontal: chartPadding, paddingBottom: chartPadding }}>
        <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(0,180,160,0.2)' }}>
          <Svg width={chartWidth} height={chartHeight}>
            <Path d={greenPath.d} fill={greenPath.color} opacity={greenPath.fillOpacity} stroke={greenPath.color} strokeWidth={2} />
            <Path d={bluePath.d} fill={bluePath.color} opacity={bluePath.fillOpacity} stroke={bluePath.color} strokeWidth={2} />
            <Path d={purplePath.d} fill={purplePath.color} opacity={purplePath.fillOpacity} stroke={purplePath.color} strokeWidth={2} />
            {/* Right edge dots */}
            <Circle cx={lastX} cy={lastGreenY} r={4} fill={colors.success} />
            <Circle cx={lastX} cy={lastBlueY} r={4} fill={colors.info} />
            <Circle cx={lastX} cy={lastPurpleY} r={4} fill={colors.primary} />
          </Svg>
        </View>
      </View>
    </View>
  );
}

function Metric({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View className="items-center">
      <Text style={{ color, fontWeight: '900', fontSize: 28 }}>{value}</Text>
      <Text className="text-gray700 mt-1">{label}</Text>
    </View>
  );
}


