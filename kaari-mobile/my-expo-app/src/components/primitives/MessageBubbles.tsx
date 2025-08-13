import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type Message = { id: string; text: string; from: 'me' | 'them'; time?: string };

export type MessageBubblesProps = {
  messages: Message[];
};

export default function MessageBubbles({ messages }: MessageBubblesProps) {
  return (
    <View className="gap-3">
      {messages.map((m) => {
        const mine = m.from === 'me';
        return (
          <View key={m.id} className={`${mine ? 'items-end' : 'items-start'} px-1.5`}>
            <View className={`${mine ? '' : 'border'} px-3.5 py-2 rounded-[14px]`} style={{ backgroundColor: mine ? colors.primary : colors.white, maxWidth: '78%', borderColor: colors.gray100, borderTopRightRadius: mine ? 4 : 14, borderTopLeftRadius: mine ? 14 : 4 }}>
              <Text style={{ color: mine ? colors.white : colors.gray700 }}>{m.text}</Text>
              {!!m.time && (
                <Text className="mt-1.5" style={{ color: mine ? colors.primaryTint2 : colors.gray500, fontSize: 12 }}>{m.time}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}


