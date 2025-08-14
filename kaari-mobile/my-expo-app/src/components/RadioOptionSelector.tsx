import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, LinearTransition, interpolate, useAnimatedStyle, useSharedValue, withTiming, interpolateColor } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import ArrowDownIcon from '../../assets/Icon_Arrow_Down.svg';

export type RadioOption = {
  value: string;
  label: string;
};

export type RadioOptionSelectorProps = {
  title: string;
  options: RadioOption[];
  icon?: React.ComponentType<any>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

function Radio({ selected }: { selected: boolean }) {
  return (
    <View
      className="items-center justify-center"
      style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.white }}
    >
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: selected ? colors.primary : 'transparent' }} />
    </View>
  );
}

export function RadioOptionSelector({ title, options, icon: LeftIcon, value, defaultValue, onChange, style, testID }: RadioOptionSelectorProps) {
  const [expanded, setExpanded] = React.useState(true);
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const current = value !== undefined ? value : internal;

  const press = useSharedValue(0);
  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(press.value, [0, 1], [colors.white, colors.primaryTint2]) as unknown as string,
  }));

  const exp = useSharedValue(expanded ? 1 : 0);
  React.useEffect(() => {
    exp.value = withTiming(expanded ? 1 : 0, { duration: 160 });
  }, [expanded]);
  const rotateStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${interpolate(exp.value, [0, 1], [0, 180])}deg` }] }));

  function select(v: string) {
    if (onChange) onChange(v);
    setInternal(v);
    setExpanded(false);
  }

  const subtitle = options.find(o => o.value === current)?.label;

  return (
    <Animated.View
      testID={testID}
      style={[containerStyle, style as any]}
      layout={LinearTransition.springify().damping(26).stiffness(200)}
    >
      {/* Header */}
      <Pressable
        accessibilityRole="button"
        onPress={() => setExpanded(e => !e)}
        onPressIn={() => (press.value = withTiming(1, { duration: 100 }))}
        onPressOut={() => (press.value = withTiming(0, { duration: 140 }))}
      >
        <View className="px-4 py-4 flex-row items-center">
          {LeftIcon ? <LeftIcon width={18} height={18} color={colors.primary} /> : null}
          <VText className="ml-2 text-[14px] leading-[14px]" weight="bold" style={{ color: colors.gray700 }} numberOfLines={1}>
            {title}
          </VText>
          {subtitle ? (
            <VText className="ml-2 text-[12px] leading-[12px]" weight="medium" style={{ color: colors.gray500 }} numberOfLines={1}>
              {subtitle}
            </VText>
          ) : null}
          <View className="flex-1" />
          <Animated.View style={rotateStyle}>
            <ArrowDownIcon width={16} height={16} color={colors.primary} stroke={colors.primary} />
          </Animated.View>
          <View className="ml-3">
            <Radio selected={!!current} />
          </View>
        </View>
      </Pressable>

      {/* Options */}
      {expanded ? (
        <Animated.View entering={FadeInDown.springify().damping(26).stiffness(200).mass(0.6)} exiting={FadeOutUp.duration(140)}>
          <View className="px-4 pb-3">
            {options.map((opt) => (
              <Pressable key={opt.value} accessibilityRole="button" onPress={() => select(opt.value)}>
                <View className="py-4 flex-row items-center">
                  <VText className="flex-1 text-[14px] leading-[14px]" weight="medium" style={{ color: colors.gray700 }} numberOfLines={1}>
                    {opt.label}
                  </VText>
                  <Radio selected={current === opt.value} />
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

export default { RadioOptionSelector };


