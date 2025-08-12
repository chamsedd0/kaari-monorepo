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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingHorizontal: 2 }}>
        <View
          style={{
            width: 48,
            height: 28,
            borderRadius: 14,
            backgroundColor: value ? colors.primary : colors.gray100,
            padding: 4,
            borderWidth: value ? 0 : 1,
            borderColor: colors.gray200,
          }}
        >
          <Animated.View style={[{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white }, knobStyle]} />
        </View>
        {!!label && <Text style={{ color: colors.gray700 }}>{label}</Text>}
      </View>
    </PressableSurface>
  );
}


