import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, LinearTransition, interpolate, useAnimatedStyle, useSharedValue, withTiming, interpolateColor } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import ArrowDownIcon from '../../assets/Icon_Arrow_Down.svg';

export type FAQItemProps = {
  question: string;
  answer: string;
  defaultExpanded?: boolean;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function FAQItem({ question, answer, defaultExpanded, style, testID }: FAQItemProps) {
  const [expanded, setExpanded] = React.useState(!!defaultExpanded);

  // Press-only background transition (not tied to expanded state)
  const press = useSharedValue(0);
  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(press.value, [0, 1], [colors.white, colors.primaryTint1]) as unknown as string,
  }));

  // Arrow rotation follows expanded state
  const exp = useSharedValue(expanded ? 1 : 0);
  React.useEffect(() => {
    exp.value = withTiming(expanded ? 1 : 0, { duration: 160 });
  }, [expanded]);
  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(exp.value, [0, 1], [0, 180])}deg` }],
  }));

  const onToggle = () => setExpanded((e) => !e);

  return (
    <Animated.View
      testID={testID}
      className="rounded-2xl border px-4"
      style={[{ borderColor: colors.primaryTint1 }, containerStyle, style as any]}
      layout={LinearTransition.springify().damping(26).stiffness(200)}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onToggle}
        onPressIn={() => (press.value = withTiming(1, { duration: 120 }))}
        onPressOut={() => (press.value = withTiming(0, { duration: 160 }))}
      >
        <View className="px-5 py-5 flex-row items-center justify-between">
          <VText className="text-[14px] leading-[14px]" weight="medium" style={{ color: colors.gray700 }}>
            {question}
          </VText>
          <Animated.View style={rotateStyle}>
            <ArrowDownIcon width={18} height={18} color={colors.gray700} stroke={colors.gray700} />
          </Animated.View>
        </View>
      </Pressable>
      {expanded ? (
        <Animated.View entering={FadeInDown.springify().damping(26).stiffness(200).mass(0.6)} exiting={FadeOutUp.duration(140)}>
          <View className="px-5 pb-4">
            <VText className="text-[12px] leading-[16px]" weight="medium" style={{ color: colors.gray500 }}>
              {answer}
            </VText>
          </View>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

export default { FAQItem };


