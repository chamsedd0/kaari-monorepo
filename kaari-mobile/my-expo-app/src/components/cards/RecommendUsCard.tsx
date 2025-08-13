import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PressableSurface from '~/components/primitives/PressableSurface';
import ArrowRight from '~/../assets/Icon_Arrow_Right.svg';
import CoinGirlGuy from '~/../assets/coin-girl-guy.svg';

export type RecommendUsCardProps = {
  title?: string;
  ctaLabel?: string;
  description?: string;
  onPress?: () => void;
};

export default function RecommendUsCard({
  title = 'Recommend us',
  description = 'Refer property owners for a smart rental solution. Earn 100 EUR after their first rent payment!',
  ctaLabel = 'Emails of property owners',
  onPress,
}: RecommendUsCardProps) {
  return (
    <View className="rounded-2xl p-5 overflow-hidden" style={{ backgroundColor: colors.primary }}>
      <View className="flex-row items-center">
        {/* Illustration on the left, keep original SVG colors */}
        <View className="w-28 items-start justify-end">
          <CoinGirlGuy width={111} height={160} />
        </View>
        <View className="flex-1 pl-4">
          <Text className="text-white font-extrabold text-base">{title}</Text>
          <Text className="text-white font-extrabold text-2xl mt-1">And get 100 EUR!</Text>
          <Text className="text-white/90 mt-2">{description}</Text>
        </View>
      </View>
      <View className="mt-4">
        <PressableSurface onPress={onPress} borderRadius={100} pressedBackground={'rgba(255,255,255,0.12)'}>
          <View
            className="flex-row items-center justify-between px-5"
            style={{ height: 48, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' }}
          >
            <Text className="text-white">{ctaLabel}</Text>
            <View className="w-9 h-9 items-center justify-center rounded-full">
              <ArrowRight width={16} height={16} />
            </View>
          </View>
        </PressableSurface>
      </View>
    </View>
  );
}


