import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PaymentsIcon from '~/../assets/Icon_Payments.svg';

export type PaymentMethodBannerAltProps = {
  label: string;
  value: string;
  onPress?: () => void;
};

export default function PaymentMethodBannerAlt({ label, value, onPress }: PaymentMethodBannerAltProps) {
  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3 rounded-2xl" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray100 }}>
      <View className="items-center justify-center rounded-[8px]" style={{ width: 28, height: 28, backgroundColor: colors.primaryTint2 }}>
        <PaymentsIcon width={16} height={16} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-gray700 font-extrabold">{label}</Text>
        <Text className="text-gray500 mt-0.5">{value}</Text>
      </View>
      <Text onPress={onPress} className="text-primary font-extrabold">Manage</Text>
    </View>
  );
}


