import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PressableSurface from '../primitives/PressableSurface';

export type FAQItemProps = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

export default function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <View style={{ borderWidth: 1, borderColor: colors.gray200, borderRadius: 16, backgroundColor: colors.white }}>
      <PressableSurface onPress={() => setOpen((v) => !v)} pressedBackground={colors.primary} borderRadius={16}>
        <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
          <Text style={{ color: colors.gray700, fontWeight: '800' }}>{question}</Text>
        </View>
      </PressableSurface>
      {open && (
        <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>
          <Text style={{ color: colors.gray500 }}>{answer}</Text>
        </View>
      )}
    </View>
  );
}


