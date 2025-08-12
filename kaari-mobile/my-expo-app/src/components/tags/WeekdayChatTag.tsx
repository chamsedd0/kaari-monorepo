import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type WeekdayChatTagProps = { weekday: string };

export default function WeekdayChatTag({ weekday }: WeekdayChatTagProps) {
  return (
    <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.white, borderColor: colors.gray200, borderWidth: 1, borderRadius: 100 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
      <Text style={{ color: colors.gray700, fontWeight: '700' }}>{weekday} chat</Text>
    </View>
  );
}


