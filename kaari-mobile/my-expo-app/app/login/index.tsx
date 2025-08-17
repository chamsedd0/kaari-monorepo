import React from 'react';
import { View, Alert } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../../src/theme/colors';
import { VText } from '../../src/components/typography';
import { Drawer } from '../../src/components/Drawer';
import { SecondaryButton, PrimaryButton } from '../../src/components/Button';
import { DefaultInput } from '../../src/components/Input';
import { useRouter } from 'expo-router';
import { startGoogleAuthSession } from '../../src/backend/firebase/auth';
import { useAuthStore } from '../../src/store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [open, setOpen] = React.useState(false);
  const logoY = useSharedValue(0);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // animate logo upward first, then open drawer
    logoY.value = withTiming(1, { duration: 500 });
    const t = setTimeout(() => setOpen(true), 380);
    return () => clearTimeout(t);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -logoY.value * 80 }],
    opacity: withTiming(1),
  }));

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const profile = await startGoogleAuthSession();
      if (!profile) {
        Alert.alert('Sign-In Failed', 'Google sign-in was not completed.');
        return;
      }
      setUser({ userId: profile.id, role: profile.role as 'advertiser' | 'client' });
      router.replace(profile.role === 'advertiser' ? '/dashboards/advertiser' : '/dashboards/client');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred during Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.primary }}>
      {/* Logo */}
      <Animated.View style={[logoStyle]}>
        <VText style={{ color: colors.white }} className="text-[40px] leading-[44px]" weight="bold">
          Kaari
        </VText>
      </Animated.View>

      {/* Bottom drawer */}
      <Drawer
        open={open}
        onOpenChange={setOpen}
        showHandle={true}
        height={340}
        header={
          <View className="items-center">
            <VText className="text-[18px] leading-[22px] mt-2" weight="bold">Log In or Sign Up</VText>
            <VText style={{ color: '#666' }} className="text-[12px] leading-[16px] mt-1 mb-2" weight="medium">
              Log into your Kaari account or if you don’t have one, create it
            </VText>
          </View>
        }
        footer={
          <View className="gap-3 mt-2">
            <View className="items-center mt-2">
              <VText style={{ color: colors.primary }} className="text-[14px]" weight="medium">Are you an advertiser?</VText>
            </View>
          </View>
        }
      >
        <View className="gap-3 mt-2">
          {/* Email login placeholder */}
          <DefaultInput value={''} onChangeText={() => {}} placeholder="Your e-mail" />
          <PrimaryButton label="Log In or Sign up" />

          <View className="items-center mt-1">
            <VText style={{ color: '#999' }}>Or</VText>
          </View>

          {/* Google Sign-In */}
          <SecondaryButton
            label={loading ? 'Signing in…' : 'Google'}
            onPress={handleGoogleSignIn}
          />
        </View>
      </Drawer>
    </View>
  );
}
