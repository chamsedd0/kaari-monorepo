import React from 'react';
import { Image, ImageSourcePropType, Pressable, View, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import KebabIcon from '../../assets/Icon_Dot Menu.svg';

export type PayoutMethodCardProps = {
  logo: ImageSourcePropType;
  bankName: string;
  last4?: string; // e.g., 1234
  expiration?: string; // e.g., 04/30
  onPress?: () => void;
  onMenuPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PayoutMethodCard({ logo, bankName, last4, expiration, onPress, onMenuPress, style, testID }: PayoutMethodCardProps) {
  const p = useSharedValue(0);
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.white, colors.primaryTint1]),
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      onPressIn={() => (p.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (p.value = withTiming(0, { duration: 160 }))}
      className="rounded-2xl"
      style={[{ borderWidth: 1, borderColor: colors.primaryTint1 }, bgStyle, style as any]}
    >
      <View className="p-4 flex-row items-center">
        <Image source={logo} style={{ width: 48, height: 48, borderRadius: 12, marginRight: 12 }} resizeMode="cover" />
        <View className="flex-1">
          <View className="flex-row items-center">
            <VText className="text-[14px] leading-[14px]" weight="bold" style={{ color: colors.gray700 }}>{bankName}</VText>
            {last4 ? (
              <VText className="ml-3 text-[14px] leading-[14px]" weight="medium" style={{ color: colors.gray500 }}>
                •  {last4}
              </VText>
            ) : null}
          </View>
          {expiration ? (
            <VText className="mt-1 text-[14px] leading-[20px]" weight="medium" style={{ color: colors.gray500 }}>
              Expiration: {expiration}
            </VText>
          ) : null}
        </View>
        <Pressable accessibilityRole="button" onPress={onMenuPress} hitSlop={8}>
          <KebabIcon width={18} height={18} color={colors.primary} />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

export default { PayoutMethodCard };


