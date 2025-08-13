import React from 'react';
import { View, Text } from 'react-native';
import PressableSurface from './PressableSurface';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '~/theme/colors';

export type SwitchProps = {
  label?: string;
  value: boolean;
  onChange?: (value: boolean) => void;
};

export default function Switch({ label, value, onChange }: SwitchProps) {
  const progress = useSharedValue(value ? 1 : 0);
  React.useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 160 });
  }, [value]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(progress.value * 20, { duration: 160 }) }],
  }));

  return (
    <PressableSurface onPress={() => onChange?.(!value)} pressedBackground={colors.primary}>
      <View className="flex-row items-center gap-2 py-1.5 px-0.5">
        <View className="rounded-[14px] p-1" style={{ width: 48, height: 28, backgroundColor: value ? colors.primary : colors.gray100, borderWidth: value ? 0 : 1, borderColor: colors.gray200 }}>
          <Animated.View style={[{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white }, knobStyle]} />
        </View>
        {!!label && <Text style={{ color: colors.gray700 }}>{label}</Text>}
      </View>
    </PressableSurface>
  );
}


