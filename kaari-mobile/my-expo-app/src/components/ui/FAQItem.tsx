import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = { question: string; answer: string };

export function FAQItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View className="border border-gray100 rounded-2xl overflow-hidden">
      <Pressable onPress={() => setOpen((v) => !v)} className="px-4 py-3 bg-white">
        <Text className="text-black font-semibold">{question}</Text>
      </Pressable>
      {open ? (
        <View className="px-4 py-3 bg-primaryTint2">
          <Text className="text-primaryDark">{answer}</Text>
        </View>
      ) : null}
    </View>
  );
}


