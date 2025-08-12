import { View, Text } from 'react-native';

export function MessageBubble({ text, mine }: { text: string; mine?: boolean }) {
  return (
    <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${mine ? 'bg-black self-end' : 'bg-gray-100 self-start'}`}>
      <Text className={`${mine ? 'text-white' : 'text-black'}`}>{text}</Text>
    </View>
  );
}


