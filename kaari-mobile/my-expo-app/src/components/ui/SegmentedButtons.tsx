import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Option = { label: string; value: string };

export function SegmentedButtons({ left, right, value, onChange }: { left: Option; right: Option; value: string; onChange: (v: string) => void }) {
  const leftActive = value === left.value;
  const pressed = useSharedValue(0);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: withTiming(pressed.value ? 0.98 : 1, { duration: 80 }) }] }));
  return (
    <Animated.View className="flex-row overflow-hidden border border-primaryTint1 rounded-bl-2xl rounded-br-2xl" style={aStyle}>
      {[left, right].map((opt, idx) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={`flex-1 py-3 items-center justify-center ${idx === 0 ? 'rounded-bl-2xl' : 'rounded-br-2xl'}`}
            onPressIn={() => (pressed.value = 1)}
            onPressOut={() => (pressed.value = 0)}
          >
            <Text className={`${active ? 'text-primary font-semibold' : 'text-primary'}`}>{opt.label}</Text>
            {idx === 0 ? <View className="absolute right-0 top-0 bottom-0 w-px bg-primaryTint1" /> : null}
          </Pressable>
        );
      })}
    </Animated.View>
  );
}


