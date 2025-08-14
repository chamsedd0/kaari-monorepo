import React from 'react';
import { Pressable, TextInput, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import PlusIcon from '../../assets/Icon_Add.svg';
import SendIcon from '../../assets/Icon_Send.svg';

export type MessageInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onPressPlus?: () => void;
  onPressSend?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function MessageInput({ value, onChangeText, placeholder = 'Write your message here...', onPressPlus, onPressSend, style, testID }: MessageInputProps) {
  const [focused, setFocused] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(20);
  const MIN_HEIGHT = 20; // fits one line at 14px line height comfortably
  const MAX_HEIGHT = 120; // cap to allow internal scrolling for very long messages
  const glow: ViewStyle = {
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  };

  const placeholderColor = focused ? colors.primaryLight : colors.gray300;

  return (
    <View testID={testID} className="flex-row items-center bg-white rounded-[100px]" style={[{ paddingVertical: 8, paddingHorizontal: 15 }, glow, style as any]}>
      <Pressable accessibilityRole="button" onPress={onPressPlus} className="w-[28px] h-[28px] items-center justify-center rounded-full" style={{ backgroundColor: colors.primaryTint1 }}>
        <PlusIcon width={22} height={22} color={colors.primary} />
      </Pressable>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 ml-2 text-[14px] leading-[14px]"
        style={{ fontFamily: 'VisbyCF', color: colors.gray700, height: Math.min(Math.max(contentHeight, MIN_HEIGHT), MAX_HEIGHT), textAlignVertical: 'top' as any }}
        multiline
        scrollEnabled={contentHeight > MAX_HEIGHT}
        onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height)}
        blurOnSubmit={false}
      />
      <Pressable accessibilityRole="button" onPress={onPressSend} disabled={!value} style={{ opacity: value ? 1 : 0.5 }}>
        <SendIcon width={22} height={22} color={colors.primary} />
      </Pressable>
    </View>
  );
}

export default { MessageInput };


