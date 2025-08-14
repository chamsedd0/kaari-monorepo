import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SecondaryButton } from '../src/components/Button';
import { VText } from '../src/components/typography';
import { colors } from '../src/theme/colors';

export default function OnboardingStart() {
  const router = useRouter();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.primary }}>
      {/* Top bar */}
      <View className="flex-row justify-end items-center px-6 pt-6">
        <Pressable onPress={() => router.push('/login')} accessibilityRole="button">
          <VText style={{ color: colors.white }} className="text-[16px] leading-[16px]" weight="bold">
            LOG IN
          </VText>
        </Pressable>
      </View>

      {/* Center content */}
      <View className="flex-1 items-center justify-center px-8">
        <View className="items-center mb-6">
          <VText style={{ color: colors.white }} className="text-[14px] leading-[22px] mb-1" weight="medium">
            Welcome to
          </VText>
          <VText style={{ color: colors.white }} className="text-[32px] leading-[36px]" weight="bold">
            Kaari
          </VText>
        </View>

        <Image source={require('../assets/door.png')} resizeMode="contain" style={{ width: 220, height: 280 }} />
      </View>

      {/* Bottom content */}
      <View className="px-6 pb-8">
        <VText style={{ color: colors.white }} className="text-[24px] leading-[28px] text-center mb-2" weight="bold">
          Hi, there!
        </VText>
        <VText style={{ color: colors.white }} className="text-[16px] leading-[22px] text-center mb-5" weight="medium">
          Welcome to Kaari, your top assistant in finding the perfect place! Which one of these are you?
        </VText>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <SecondaryButton label="I'm an advertiser" onPress={() => router.push('/onboarding/advertiser')} />
          </View>
          <View className="flex-1">
            <SecondaryButton label="I'm a tenant" onPress={() => router.push('/onboarding/tenant')} />
          </View>
        </View>
      </View>
    </View>
  );
}


