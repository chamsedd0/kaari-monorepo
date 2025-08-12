import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type TimerBlockSize = 'big' | 'small';
export type TimerBlockScheme = 'white' | 'purple';

export type TimerBlockProps = {
  value: string; // already formatted (e.g., '1', '23')
  size: TimerBlockSize;
  scheme: TimerBlockScheme;
  label?: string; // only for big variant per PNG
};

export default function TimerBlock({ value, size, scheme, label }: TimerBlockProps) {
  const isBig = size === 'big';
  const isPurple = scheme === 'purple';

  // Visuals tuned to PNGs
  const backgroundColor = isPurple ? colors.primaryTint2 : colors.gray300;
  const textColor = isPurple ? colors.primary : colors.white;
  const borderWidth = 0;

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          backgroundColor,
          borderColor: isPurple ? colors.primary : colors.gray300,
          borderWidth,
          borderRadius: 16,
          paddingHorizontal: isBig ? 22 : 14,
          paddingVertical: isBig ? 16 : 10,
          minWidth: isBig ? 68 : 48,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: textColor,
            fontWeight: '800',
            fontSize: isBig ? 32 : 22,
            fontVariant: ['tabular-nums'],
          }}
        >
          {value}
        </Text>
      </View>
      {isBig && !!label && (
        <Text style={{ color: colors.white, marginTop: 8 }}>{label}</Text>
      )}
    </View>
  );
}


