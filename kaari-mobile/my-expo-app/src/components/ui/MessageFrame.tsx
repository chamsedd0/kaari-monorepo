import { View, Text } from 'react-native';
import { MessageBubble } from '../chat/MessageBubble';

export function MessageFrame({ title, messages }: { title: string; messages: { text: string; mine?: boolean }[] }) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 gap-2">
      <Text className="text-black font-semibold mb-2">{title}</Text>
      <View className="gap-2">
        {messages.map((m, i) => (
          <MessageBubble key={i} text={m.text} mine={m.mine} />
        ))}
      </View>
    </View>
  );
}


