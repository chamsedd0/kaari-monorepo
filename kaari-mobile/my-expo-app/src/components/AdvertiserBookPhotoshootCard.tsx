import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import { SecondaryButton } from './Button';
import CameraIcon from '../../assets/Icon_Photoshoot.svg';
import Illustration from '../../assets/Layer_1.svg';

type AdvertiserBookPhotoshootCardProps = {
  onPress?: () => void;
  onActionPress?: () => void;
  style?: ViewStyle | ViewStyle[];
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AdvertiserBookPhotoshootCard({ onPress, onActionPress, style }: AdvertiserBookPhotoshootCardProps) {
  const p = useSharedValue(0);
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.primary, colors.primaryDark]),
  }));

  return (
    <AnimatedPressable
      className="rounded-2xl overflow-hidden"
      style={[bgStyle, style as any]}
      onPressIn={() => (p.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (p.value = withTiming(0, { duration: 160 }))}
      onPress={onPress}
    >
      <View className="p-6 flex-row">
        <View className="flex-1 pr-6">
          <View className="flex-row items-center">
            <View className="flex-1">
              <VText className="text-white text-[16px] leading-[16px]" weight="bold">Host your property</VText>
              <VText className="text-white text-[24px] leading-[28px] mt-2" weight="bold">Book a Photoshoot!</VText>
              <VText className="text-white text-[12px] leading-[16px] mt-3" weight="medium">
                You want to host your property? Book a photoshoot right now!
              </VText>
            </View>
            <View className="ml-2">
              <Illustration width={90} height={120} stroke={colors.primary} strokeWidth={1.5} fill={colors.white} />
            </View>
          </View>
          <View className="mt-4 w-full">
            <SecondaryButton
              label="Book a photoshoot"
              icon={<CameraIcon width={18} height={18} fill={colors.primary} stroke={colors.primary} strokeWidth={1.5} />}
              onPress={onActionPress}
            />
          </View>
        </View>
        
      </View>
    </AnimatedPressable>
  );
}

export default { AdvertiserBookPhotoshootCard };


