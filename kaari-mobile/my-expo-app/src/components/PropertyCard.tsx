import React from 'react';
import { View, Text, Image, Pressable, ViewStyle, ScrollView } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { SectionBadge } from './Badges';
import { PaginationDots } from './PaginationDots';
import { GenderTag } from './GenderTag';
import { VerifiedTag, PeopleTag } from './Tag';
import HeartIcon from '../../assets/Icon_Favorites.svg';
import ArrowLeftIcon from '../../assets/Icon_Arrow_Left.svg';
import ArrowRightIcon from '../../assets/Icon_Arrow_Right.svg';

type PropertyCardProps = {
  imageUri: string;
  images?: string[]; // optional gallery overrides imageUri
  title: string; // with " - " split pattern
  depositLabel: string; // e.g., "Deposit 300$\nMin.stay 30 days"
  priceLabel: string; // e.g., "300$/month"
  sectionLabel?: string; // e.g., TOP PICK
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PropertyCard({ imageUri, images, title, depositLabel, priceLabel, sectionLabel = 'TOP PICK', onPress, style }: PropertyCardProps) {
  const p = useSharedValue(0);
  const bgStyle = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(p.value, [0, 1], [colors.white, colors.primaryTint2]) }));
  const parts = title.split(' - ');
  const type = parts[0] ?? title;
  const rest = parts.slice(1).join(' - ');
  const gallery = images && images.length > 0 ? images : [imageUri];
  const [active, setActive] = React.useState(0);
  const [width, setWidth] = React.useState<number | null>(null);
  const scrollRef = React.useRef<ScrollView>(null);
  return (
    <AnimatedPressable
      className="rounded-2xl overflow-hidden"
      style={[bgStyle, style as any]}
      onPressIn={() => (p.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (p.value = withTiming(0, { duration: 160 }))}
      onPress={onPress}
    >
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const w = width ?? e.nativeEvent.layoutMeasurement.width;
            const index = Math.round(e.nativeEvent.contentOffset.x / Math.max(1, w));
            if (index !== active) setActive(index);
          }}
          scrollEventThrottle={16}
        >
          {gallery.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={{ width: width ?? '100%', height: Math.max(300, 300), borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }} resizeMode="cover" />
          ))}
        </ScrollView>
        {/* Navigation buttons */}
        {gallery.length > 1 ? (
          <>
            <Pressable
              onPress={() => {
                if (!width) return;
                const next = Math.max(0, active - 1);
                setActive(next);
                scrollRef.current?.scrollTo({ x: next * width, animated: true });
              }}
              style={{ position: 'absolute', left: 8, top: '45%' }}
            >
              <View className="w-8 h-8 rounded-full items-center justify-center bg-white/70">
                <ArrowLeftIcon width={18} height={18} color={colors.primary} />
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                if (!width) return;
                const next = Math.min(gallery.length - 1, active + 1);
                setActive(next);
                scrollRef.current?.scrollTo({ x: next * width, animated: true });
              }}
              style={{ position: 'absolute', right: 8, top: '45%' }}
            >
              <View className="w-8 h-8 rounded-full items-center justify-center bg-white/70">
                <ArrowRightIcon width={18} height={18} color={colors.primary} />
              </View>
            </Pressable>
          </>
        ) : null}
        <View style={{ position: 'absolute', left: 0, top: 0 }}>
          <SectionBadge label={sectionLabel} variant="gold" />
        </View>
        <View style={{ position: 'absolute', left: 12, top: 56 }}>
          <PeopleTag count={2} variant="white" />
        </View>
        <View style={{ position: 'absolute', right: 10, top: 10 }}>
          <HeartIcon width={24} height={24} color={colors.white} stroke={colors.white} />
        </View>
        <View style={{ position: 'absolute', alignSelf: 'center', top: 12 }}>
          <PaginationDots count={gallery.length} activeIndex={active} />
        </View>
        <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
          <GenderTag size={36} />
        </View>
        <View style={{ position: 'absolute', left: 10, bottom: 10, flexDirection: 'row', columnGap: 8 }}>
          <VerifiedTag label="Kaari Verified" variant="purple" />
        </View>
      </View>
      <View className="px-4 py-3">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-[16px]" style={{ color: colors.gray700, maxWidth: '50%' }} >
            <Text style={{ fontFamily: 'VisbyCF-Bold', lineHeight: 16 }}>{type}</Text>
            {rest ? <Text style={{ fontFamily: 'VisbyCF', fontWeight: '500', lineHeight: 22 }}>{` - ${rest}`}</Text> : null}
          </Text>
          <View className="items-end">
            <Text className="text-[12px] leading-[16px] text-right" style={{ color: colors.gray500, fontFamily: 'VisbyCF' }}>{depositLabel}</Text>
            <Text className="text-[20px] leading-[22px] mt-1 text-right" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Heavy' }}>{priceLabel}</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default { PropertyCard };


