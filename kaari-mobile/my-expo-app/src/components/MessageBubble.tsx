import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

type Tone = 'accent' | 'neutral';
type Shade = 'strong' | 'soft';

type MessageBubbleProps = {
  text: string;
  time: string;
  align?: 'left' | 'right';
  tone?: Tone; // accent (purple tints) or neutral (white/gray)
  shade?: Shade; // strong vs soft tint
  style?: ViewStyle | ViewStyle[];
};

export function MessageBubble({ text, time, align = 'left', tone = 'accent', shade = 'soft', style }: MessageBubbleProps) {
  const isLeft = align === 'left';
  const backgroundColor = tone === 'accent'
    ? (shade === 'strong' ? colors.primaryTint1 : colors.primaryTint2)
    : (shade === 'strong' ? colors.gray100 : colors.white);
  const timeColor = tone === 'accent' ? colors.gray500 : colors.gray500;
  const textColor = colors.gray700;
  return (
    <View className="w-full" style={style}>
      <View className={isLeft ? 'items-start' : 'items-end'}>
        <View className="relative max-w-[80%] rounded-2xl px-4 py-3" style={{ backgroundColor }}>
          {isLeft ? (
            <View style={{ position: 'absolute', left: -6, top: 10, width: 12, height: 12, backgroundColor, transform: [{ rotate: '45deg' }], borderTopRightRadius: 2 }} />
          ) : (
            <View style={{ position: 'absolute', right: -6, top: 10, width: 12, height: 12, backgroundColor, transform: [{ rotate: '45deg' }], borderTopLeftRadius: 2 }} />
          )}
          <View className="flex-row items-center">
            <Text className="text-[14px] leading-[18px] flex-shrink" style={{ color: textColor, fontFamily: 'VisbyCF' }}>
              {text}
            </Text>
            <View className="flex-1" />
            <Text className="text-[12px] leading-[12px] ml-3" style={{ color: timeColor, fontFamily: 'VisbyCF' }}>
              {time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default { MessageBubble };


