import 'react-native-gesture-handler';
import '../global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import React from 'react';
import { Text, TextInput } from 'react-native';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    VisbyCF: require('../assets/fonts/VisbyCF-Medium.otf'),
    'VisbyCF-DemiBold': require('../assets/fonts/VisbyCF-DemiBold.otf'),
    'VisbyCF-Bold': require('../assets/fonts/VisbyCF-Bold.otf'),
    'VisbyCF-Heavy': require('../assets/fonts/VisbyCF-Heavy.otf'),
  });
  if (!fontsLoaded) return null;

  setCustomText({ style: { fontFamily: 'VisbyCF' } });
  setCustomTextInput({ style: { fontFamily: 'VisbyCF' } });

  // Also set React Native defaults as a fallback for any components bypassing global-props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Text as any).defaultProps = { ...(Text as any).defaultProps, style: [{ fontFamily: 'VisbyCF' }, (Text as any).defaultProps?.style] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (TextInput as any).defaultProps = { ...(TextInput as any).defaultProps, style: [{ fontFamily: 'VisbyCF' }, (TextInput as any).defaultProps?.style] };

  // Map fontWeight to the correct Visby CF family (Android requires explicit families per weight)
  const originalRender = (Text as any).render;
  if (!(Text as any).__visbyPatched) {
    (Text as any).__visbyPatched = true;
    (Text as any).render = function (...args: any[]) {
      const element = originalRender.apply(this, args);
      const styleArray = Array.isArray(element.props.style) ? element.props.style : [element.props.style].filter(Boolean);
      const weightEntry = styleArray.find((s: any) => s && s.fontWeight);
      const weight: string | undefined = weightEntry?.fontWeight;
      let family = 'VisbyCF';
      if (weight === '800' || weight === '900') family = 'VisbyCF-Heavy';
      else if (weight === '700' || weight === 'bold') family = 'VisbyCF-Bold';
      else if (weight === '600' || weight === 'semibold') family = 'VisbyCF-DemiBold';
      return React.cloneElement(element, {
        style: [{ fontFamily: family }, element.props.style],
      });
    };
  }

  const originalInputRender = (TextInput as any).render;
  if (!(TextInput as any).__visbyPatched) {
    (TextInput as any).__visbyPatched = true;
    (TextInput as any).render = function (...args: any[]) {
      const element = originalInputRender.apply(this, args);
      const styleArray = Array.isArray(element.props.style) ? element.props.style : [element.props.style].filter(Boolean);
      const weightEntry = styleArray.find((s: any) => s && s.fontWeight);
      const weight: string | undefined = weightEntry?.fontWeight;
      let family = 'VisbyCF';
      if (weight === '800' || weight === '900') family = 'VisbyCF-Heavy';
      else if (weight === '700' || weight === 'bold') family = 'VisbyCF-Bold';
      else if (weight === '600' || weight === 'semibold') family = 'VisbyCF-DemiBold';
      return React.cloneElement(element, {
        style: [{ fontFamily: family }, element.props.style],
      });
    };
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerTitleStyle: { fontFamily: 'VisbyCF' } }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="components" options={{ title: 'Components' }} />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


