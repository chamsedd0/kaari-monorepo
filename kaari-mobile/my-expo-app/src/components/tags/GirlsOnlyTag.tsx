import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export default function GirlsOnlyTag() {
  return (
    <View style={{ alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.primaryTint2, borderRadius: 100 }}>
      <Text style={{ color: colors.primary, fontWeight: '700' }}>Girls only</Text>
    </View>
  );
}


