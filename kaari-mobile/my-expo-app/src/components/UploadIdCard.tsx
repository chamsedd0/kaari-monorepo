import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import UploadIcon from '../../assets/Icon_Upload.svg';

export type UploadIdCardProps = {
  title: string;
  description: string;
  maxSizeText: string; // e.g., "Maximum size: 7 MB"
  formatsText: string; // e.g., "Accepted formats: pdf, png, jpg, jpeg, doc, docx"
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function UploadIdCard({ title, description, maxSizeText, formatsText, onPress, style, testID }: UploadIdCardProps) {
  const p = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.white, colors.primaryTint1]),
  }));

  return (
    <Animated.View
      className="rounded-2xl border"
      style={[{ borderColor: colors.primaryTint1 }, animatedStyle, style as any]}
      testID={testID}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={() => (p.value = withTiming(1, { duration: 120 }))}
        onPressOut={() => (p.value = withTiming(0, { duration: 180 }))}
      >
        <View className="p-5">
          <VText className="text-[16px] leading-[16px]" weight="bold" style={{ color: colors.gray700 }}>{title}</VText>
          <VText className="mt-5 text-[14px] leading-[20px]" weight="medium" style={{ color: colors.gray500 }}>{description}</VText>
          <VText className="mt-4 text-[12px] leading-[12px]" weight="medium" style={{ color: colors.gray300 }}>{maxSizeText}</VText>
          <VText className="mt-1 text-[12px] leading-[12px]" weight="medium" style={{ color: colors.gray300, maxWidth: '75%' }}>{formatsText}</VText>
        </View>
        <View style={{ position: 'absolute', right: 16, bottom: 16 }}>
          <UploadIcon width={27} height={27} color={colors.primary} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default { UploadIdCard };


