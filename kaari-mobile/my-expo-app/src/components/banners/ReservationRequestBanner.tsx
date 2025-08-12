import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type ReservationRequestBannerProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onPressCta?: () => void;
};

export default function ReservationRequestBanner({ title, subtitle, ctaLabel = 'View', onPressCta }: ReservationRequestBannerProps) {
  return (
    <View style={{ borderRadius: 16, backgroundColor: colors.primaryTint2, padding: 14, borderWidth: 1, borderColor: colors.primary }}>
      <Text style={{ color: colors.primary, fontWeight: '800' }}>{title}</Text>
      {!!subtitle && <Text style={{ color: colors.gray700, marginTop: 4 }}>{subtitle}</Text>}
      {!!ctaLabel && (
        <Text onPress={onPressCta} style={{ color: colors.primary, fontWeight: '800', marginTop: 8 }}>
          {ctaLabel}
        </Text>
      )}
    </View>
  );
}


