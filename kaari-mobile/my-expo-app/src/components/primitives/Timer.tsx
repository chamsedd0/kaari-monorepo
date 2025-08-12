import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type TimerProps = {
  size?: 'small' | 'big';
  colorScheme?: 'white' | 'purple';
  timeText: string; // formatted text externally to keep dynamic
  rounded?: boolean;
};

export default function Timer({ size = 'small', colorScheme = 'purple', timeText, rounded = true }: TimerProps) {
  const isBig = size === 'big';
  const isPurple = colorScheme === 'purple';
  const bg = isPurple ? 'primary' : 'white';
  const fg = isPurple ? 'white' : 'primary';

  return (
    <View
      style={{
        backgroundColor: colors[bg],
        paddingHorizontal: isBig ? 18 : 12,
        paddingVertical: isBig ? 12 : 6,
        borderRadius: rounded ? (isBig ? 16 : 12) : 4,
        borderWidth: isPurple ? 0 : 1,
        borderColor: isPurple ? 'transparent' : colors.primary,
      }}
    >
      <Text style={{ color: colors[fg], fontSize: isBig ? 22 : 14, fontWeight: '800' }}>{timeText}</Text>
    </View>
  );
}


