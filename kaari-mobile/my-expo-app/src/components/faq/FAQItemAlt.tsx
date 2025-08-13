import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type FAQItemAltProps = {
  question: string;
  answer: string;
};

export default function FAQItemAlt({ question, answer }: FAQItemAltProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <View className="rounded-2xl border" style={{ borderColor: colors.gray100, backgroundColor: colors.white }}>
      <View className="px-3.5 py-3" onTouchEnd={() => setOpen((v) => !v)}>
        <Text className="text-gray700 font-extrabold">{question}</Text>
      </View>
      {open && (
        <View className="px-3.5 pb-3">
          <Text className="text-gray500">{answer}</Text>
        </View>
      )}
    </View>
  );
}


