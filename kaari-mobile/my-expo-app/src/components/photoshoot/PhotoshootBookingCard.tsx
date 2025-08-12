import { View, Text, Pressable } from 'react-native';
import { Icon } from '../ui/Icon';
import { SectionBadge } from '../ui/SectionBadge';

export function PhotoshootBookingCard({ title, step, cta, onPress }: { title: string; step: string; cta: string; onPress?: () => void }) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-4 gap-2 relative">
      <SectionBadge label="Photoshoot" color="primary" />
      <Text style={{ fontFamily: 'VisbyCF' }} className="text-gray500 text-xs mt-2">{step}</Text>
      <Text style={{ fontFamily: 'VisbyCF-Bold' }} className="text-2xl text-black">{title}</Text>
      <Pressable onPress={onPress} className="self-start flex-row items-center gap-2 bg-primary rounded-2xl px-4 py-2">
        <Icon name="photoshoot" width={16} height={16} />
        <Text style={{ fontFamily: 'VisbyCF-DemiBold' }} className="text-white">{cta}</Text>
      </Pressable>
    </View>
  );
}


