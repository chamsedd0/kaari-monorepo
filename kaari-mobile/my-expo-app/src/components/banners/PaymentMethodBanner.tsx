import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PaymentsIcon from '~/../assets/Icon_Payments.svg';

export type PaymentMethodBannerProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export default function PaymentMethodBanner({ title, subtitle, actionLabel = 'Manage', onPressAction }: PaymentMethodBannerProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, backgroundColor: colors.white, padding: 14, borderWidth: 1, borderColor: colors.gray200 }}>
      <View style={{ width: 36, height: 36, borderRadius: 100, backgroundColor: colors.primaryTint2, alignItems: 'center', justifyContent: 'center' }}>
        <PaymentsIcon width={18} height={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.gray700, fontWeight: '800' }}>{title}</Text>
        {!!subtitle && <Text style={{ color: colors.gray500, marginTop: 2 }}>{subtitle}</Text>}
      </View>
      {!!actionLabel && (
        <Text onPress={onPressAction} style={{ color: colors.primary, fontWeight: '800' }}>
          {actionLabel}
        </Text>
      )}
    </View>
  );
}


