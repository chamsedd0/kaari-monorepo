import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type Message = { id: string; text: string; from: 'me' | 'them'; time?: string };

export type MessageBubblesProps = {
  messages: Message[];
};

export default function MessageBubbles({ messages }: MessageBubblesProps) {
  return (
    <View style={{ gap: 12 }}>
      {messages.map((m) => {
        const mine = m.from === 'me';
        return (
          <View key={m.id} style={{ alignItems: mine ? 'flex-end' : 'flex-start', paddingHorizontal: 6 }}>
            <View
              style={{
                backgroundColor: mine ? colors.primary : colors.white,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 14,
                borderTopRightRadius: mine ? 4 : 14,
                borderTopLeftRadius: mine ? 14 : 4,
                maxWidth: '78%',
                borderWidth: mine ? 0 : 1,
                borderColor: colors.gray100,
              }}
            >
              <Text style={{ color: mine ? colors.white : colors.gray700 }}>{m.text}</Text>
              {!!m.time && (
                <Text style={{ color: mine ? colors.primaryTint2 : colors.gray500, fontSize: 12, marginTop: 6 }}>{m.time}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}


