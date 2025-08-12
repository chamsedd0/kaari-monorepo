import { Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Icon } from './Icon';

type Variant = 'primary' | 'secondary' | 'segmented';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
  iconName?: Parameters<typeof Icon>[0]['name'];
};

export function Button({ title, onPress, disabled, variant = 'primary', style, iconName }: Props) {
  const pressed = useSharedValue(0);
  const base = 'rounded-full px-6 py-3 items-center justify-center';

  const bgCls = variant === 'primary' ? 'bg-primary' : variant === 'secondary' ? 'bg-white' : '';
  const borderCls = variant === 'secondary' ? 'border border-primaryTint1' : '';
  const textCls = variant === 'primary' ? 'text-white' : 'text-primary';

  const aStyle = useAnimatedStyle(() => ({
    opacity: withTiming(disabled ? 0.6 : 1, { duration: 120 }),
    transform: [{ scale: withTiming(pressed.value ? 0.98 : 1, { duration: 100 }) }],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
    >
      <Animated.View className={`${base} ${bgCls} ${borderCls}`} style={[aStyle, style]}> 
        <View className="flex-row items-center gap-2">
          <Text className={`font-semibold ${textCls}`}>{title}</Text>
          {iconName ? <Icon name={iconName} width={18} height={18} fill={variant === 'primary' ? '#FFFFFF' : '#8F27CE'} /> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}


