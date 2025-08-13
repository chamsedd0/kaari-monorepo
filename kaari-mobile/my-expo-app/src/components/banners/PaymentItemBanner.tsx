import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PaymentsIcon from '~/../assets/Icon_Payments.svg';

export type PaymentItemBannerProps = {
  title: string;
  amount: string;
  date?: string;
};

export default function PaymentItemBanner({ title, amount, date }: PaymentItemBannerProps) {
  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3 rounded-2xl" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray100 }}>
      <View className="items-center justify-center rounded-[8px]" style={{ width: 28, height: 28, backgroundColor: colors.primaryTint2 }}>
        <PaymentsIcon width={16} height={16} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-gray700 font-extrabold">{title}</Text>
        {!!date && <Text className="text-gray500 mt-0.5">{date}</Text>}
      </View>
      <Text className="text-primary font-extrabold">{amount}</Text>
    </View>
  );
}


