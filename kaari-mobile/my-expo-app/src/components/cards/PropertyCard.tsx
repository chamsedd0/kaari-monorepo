import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import SectionBadge from '~/components/badge/SectionBadge';

export type PropertyCardProps = {
  title: string;
  price: string;
  badge?: string;
};

export function PropertyCard({ title, price, badge }: PropertyCardProps) {
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <View className="flex-row items-center justify-between">
        <Text style={{ color: colors.gray700, fontWeight: '800' }}>{title}</Text>
        {!!badge && <SectionBadge text={badge} variant="purple" />}
      </View>
      <Text style={{ color: colors.primary, fontWeight: '800' }}>{price}</Text>
    </View>
  );
}

export default PropertyCard;


