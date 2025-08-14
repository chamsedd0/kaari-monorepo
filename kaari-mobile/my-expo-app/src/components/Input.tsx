import React from 'react';
import { TextInput, View, ViewStyle, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolateColor } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import EyeIcon from '../../assets/Icon_Show.svg';
import EyeOffIcon from '../../assets/Icon_Hide.svg';
import SendIcon from '../../assets/Icon_Send.svg';
import AttachIcon from '../../assets/Icon_Attach.svg';

type InputState = 'default' | 'focused' | 'error';

type BaseProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  style?: ViewStyle | ViewStyle[];
  rightIcon?: React.ReactNode; // ignored for Password/RecommendUs/Upload where icon is managed internally
  rightIconFactory?: (color: string) => React.ReactNode; // use to sync icon color with border
  testID?: string;
};

function getBorderColor(state: InputState): string {
  switch (state) {
    case 'focused':
      return colors.primary;
    case 'error':
      return colors.danger;
    default:
      return colors.inputBorder;
  }
}

export function DefaultInput({ value, onChangeText, placeholder, error, style, rightIcon, rightIconFactory, testID }: BaseProps) {
  const [focused, setFocused] = React.useState(false);
  const state: InputState = error ? 'error' : focused ? 'focused' : 'default';
  const borderColor = getBorderColor(state);
  const colorIndex = useSharedValue(error ? 2 : focused ? 1 : 0);
  React.useEffect(() => {
    colorIndex.value = withTiming(error ? 2 : focused ? 1 : 0, { duration: 160 });
  }, [focused, error]);
  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(colorIndex.value, [0, 1, 2], [colors.inputBorder, colors.primary, colors.danger]),
  }));
  const computedRightIcon = rightIconFactory ? rightIconFactory(borderColor) : rightIcon;

  return (
    <Animated.View
      testID={testID}
      className="flex-row items-center rounded-[100px] border px-[15px] py-[4px] bg-white"
      style={[animatedStyle, style as any]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={borderColor}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 text-gray700 text-[14px] leading-[18px] font-medium"
      />
      {computedRightIcon ? <View className="ml-3">{computedRightIcon}</View> : null}
    </Animated.View>
  );
}

export function PasswordInput({ value, onChangeText, placeholder, error, style, testID }: Omit<BaseProps, 'rightIcon'>) {
  const [focused, setFocused] = React.useState(false);
  const [secure, setSecure] = React.useState(true);
  const state: InputState = error ? 'error' : focused ? 'focused' : 'default';
  const borderColor = getBorderColor(state);
  const colorIndex = useSharedValue(error ? 2 : focused ? 1 : 0);
  React.useEffect(() => {
    colorIndex.value = withTiming(error ? 2 : focused ? 1 : 0, { duration: 160 });
  }, [focused, error]);
  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(colorIndex.value, [0, 1, 2], [colors.inputBorder, colors.primary, colors.danger]),
  }));
  const Icon = secure ? EyeIcon : EyeOffIcon;

  return (
    <Animated.View testID={testID} className="flex-row items-center rounded-[100px] border px-[15px] py-[4px] bg-white" style={[animatedStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        placeholder={placeholder}
        placeholderTextColor={borderColor}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 text-gray700 text-[14px] leading-[18px] font-medium"
      />
      <Pressable onPress={() => setSecure(s => !s)} accessibilityRole="button">
        <Icon width={22} height={22} color={borderColor} stroke={borderColor} strokeWidth={1.5} />
      </Pressable>
    </Animated.View>
  );
}

export function UploadInput({ placeholder, uploaded = false, fileName, onPress, style, testID }: { placeholder?: string; uploaded?: boolean; fileName?: string; onPress?: () => void; style?: ViewStyle | ViewStyle[]; testID?: string }) {
  const borderColor = colors.inputBorder; // fixed border colors per spec
  const backgroundColor = uploaded ? colors.primaryTint2 : colors.white;
  const labelColor = uploaded ? colors.gray700 : borderColor;
  const labelText = uploaded && fileName ? fileName : placeholder;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      testID={testID}
      className="flex-row items-center rounded-[100px] border px-[15px] py-[12px]"
      style={{ backgroundColor, borderColor }}
    >
      <Text className="flex-1 text-[14px] leading-[18px] font-medium" style={{ color: labelColor }} numberOfLines={1}>
        {labelText}
      </Text>
      <AttachIcon width={22} height={22} color={colors.primary} />
    </Pressable>
  );
}

export function TextArea({ value, onChangeText, placeholder, error, style, testID }: BaseProps) {
  const [focused, setFocused] = React.useState(false);
  const state: InputState = error ? 'error' : focused ? 'focused' : 'default';
  const borderColor = getBorderColor(state);
  const colorIndex = useSharedValue(error ? 2 : focused ? 1 : 0);
  React.useEffect(() => {
    colorIndex.value = withTiming(error ? 2 : focused ? 1 : 0, { duration: 160 });
  }, [focused, error]);
  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(colorIndex.value, [0, 1, 2], [colors.inputBorder, colors.primary, colors.danger]),
  }));
  return (
    <Animated.View testID={testID} className="bg-white rounded-xl border px-[10px] py-[4px]" style={[animatedStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={borderColor}
        multiline
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="min-h-[120px] text-gray700 text-[14px] leading-[18px] font-medium"
        style={{ textAlignVertical: 'top' as any }}
      />
    </Animated.View>
  );
}

export function RecommendUsInput({ value, onChangeText, placeholder, style, testID }: Omit<BaseProps, 'error' | 'rightIcon'>) {
  return (
    <View
      testID={testID}
      className="flex-row items-center rounded-[100px] border px-[15px] py-[4px] overflow-hidden"
      style={[{ borderColor: colors.white }, style as any]}
    >
      <BlurView intensity={2} experimentalBlurMethod='dimezisBlurView' style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: `${colors.primaryLight}70` }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.white}
        className="flex-1 text-white text-[14px] leading-[18px] font-medium"
      />
      <SendIcon width={20} height={20} color={colors.white} />
    </View>
  );
}

export default {
  DefaultInput,
  PasswordInput,
  UploadInput,
  TextArea,
  RecommendUsInput,
};


