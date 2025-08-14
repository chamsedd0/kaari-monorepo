import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';

type TimerVariant = 'white' | 'purple';
type TimerSize = 'big' | 'small';

export type TimerProps = {
  variant?: TimerVariant;
  size?: TimerSize;
  // If provided, the timer will tick down to this epoch (ms). Otherwise, values are shown statically.
  untilEpochMs?: number;
  // Optional static values to render. If `untilEpochMs` is provided these are ignored.
  value?: { days?: number; hours: number; minutes: number; seconds: number };
  showDays?: boolean; // defaults to true if value.days provided
  testID?: string;
  style?: ViewStyle | ViewStyle[];
};

type Unit = 'days' | 'hours' | 'minutes' | 'seconds';

function pad2(num: number) {
  return num < 10 ? `0${num}` : `${num}`;
}

function computeRemaining(untilEpochMs: number) {
  const now = Date.now();
  let diff = Math.max(0, Math.floor((untilEpochMs - now) / 1000));
  const days = Math.floor(diff / 86400);
  diff -= days * 86400;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  diff -= minutes * 60;
  const seconds = diff;
  return { days, hours, minutes, seconds };
}

/**
 * Animated number that subtly eases on change for smoothness.
 */
function AnimatedNumber({
  text,
  color,
  fontSize,
  lineHeight,
  weight = 'bold',
}: {
  text: string;
  color: string;
  fontSize: number;
  lineHeight: number;
  weight?: 'medium' | 'bold' | 'heavy' | 'regular' | 'semibold';
}) {
  // Render normally without opacity animations to avoid flicker
  return (
    <VText
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ color, fontSize, lineHeight }}
      weight={weight}
    >
      {text}
    </VText>
  );
}

function Box({
  children,
  label,
  variant,
  size,
  widthOverride,
  heightOverride,
}: {
  children: React.ReactNode;
  label?: string;
  variant: TimerVariant;
  size: TimerSize;
  widthOverride?: number;
  heightOverride?: number;
}) {
  const isBig = size === 'big';
  const radius = 12; // big and small use 12px per spec
  const paddingVertical = isBig ? 20 : 12; // px
  const paddingHorizontal = isBig ? 4 : 4; // px (small spec says 4 too)

  // Default box sizes per spec; can be overridden for responsiveness
  const defaultWidth = isBig ? 70 : 48;
  const defaultHeight = isBig ? 100 : 56;
  // For big, allow width to auto-size so the layout can compress without overflow
  const width = isBig ? (widthOverride as number | undefined) : defaultWidth;
  const height = heightOverride ?? defaultHeight;

  // Backgrounds – avoid heavy BlurView due to halo/pixelation on some Android devices.
  let baseBg: ViewStyle = {};
  if (variant === 'purple') {
    baseBg = { backgroundColor: 'rgba(98,24,168,0.15)' };
  } else {
    baseBg = { backgroundColor: 'rgba(255,255,255,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' };
  }

  return (
    <View
      className="items-center"
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        borderRadius: radius,
        paddingVertical,
        paddingHorizontal,
        width,
        height: height as number,
        alignItems: 'center',
        justifyContent: 'center',
        ...baseBg,
        position: 'relative',
        // allow content to overflow so large digits are never invisible
        overflow: 'visible',
      }}
    >
      {/* Simulated glass via translucent background and soft stroke; no BlurView to preserve radius crispness */}
      <View>{children}</View>
      {isBig && label ? (
        <VText
          weight="medium"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: 10,
            fontSize: 12,
            lineHeight: 12,
            color: variant === 'purple' ? colors.primary : colors.white,
            textAlign: 'center',
          }}
        >
          {label}
        </VText>
      ) : null}
    </View>
  );
}

function Colon({ variant, size }: { variant: TimerVariant; size: TimerSize }) {
  const gap = size === 'big' ? 6 : 2;
  const height = size === 'big' ? 20 * 2 + 40 + 10 + 12 : 56; // mirror Box
  return (
    <View style={{ marginHorizontal: gap, height, alignItems: 'center', justifyContent: 'center' }}>
      <VText
        weight="bold"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          color: variant === 'purple' ? colors.primary : colors.white,
          fontSize: size === 'big' ? 40 : 32,
          lineHeight: size === 'big' ? 40 : 32,
          textAlign: 'center',
        }}
      >
        :
      </VText>
    </View>
  );
}

export function Timer({ variant = 'white', size = 'big', untilEpochMs, value, showDays, testID, style }: TimerProps) {
  const isBig = size === 'big';
  const [state, setState] = React.useState(() => {
    if (untilEpochMs) return computeRemaining(untilEpochMs);
    const v = value ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return { days: v.days ?? 0, hours: v.hours, minutes: v.minutes, seconds: v.seconds };
  });
  // React Native timers return a numeric id; avoid NodeJS types to prevent type errors in non-Node envs
  const intervalIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!untilEpochMs) return;
    const tick = () => setState(computeRemaining(untilEpochMs));
    const start = () => {
      tick();
      intervalIdRef.current = setInterval(tick, 1000) as unknown as number;
    };
    // Align to the next second boundary
    const nowMs = Date.now();
    const delay = 1000 - (nowMs % 1000);
    const timeoutId = setTimeout(start, delay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalIdRef.current) clearInterval(intervalIdRef.current as any);
      intervalIdRef.current = null;
    };
  }, [untilEpochMs]);

  const labels: Record<Unit, string> = { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' };
  const shouldShowDays = (showDays ?? state.days > 0) || isBig; // always keep place for big layout

  const numberColor = variant === 'purple' ? colors.primary : colors.white;

  const numFontSize = isBig ? 40 : 32;
  const numLineHeight = isBig ? 40 : 32;

  const renderUnit = (unit: Unit, n: number) => {
    const text = unit === 'days' ? `${n}` : pad2(n);
    return (
      <Box
        label={isBig ? labels[unit] : undefined}
        variant={variant}
        size={size}
        // For big boxes, compute responsive width so the whole timer fits within available width
        widthOverride={isBig ? undefined : undefined}
      >
        <AnimatedNumber text={text} color={numberColor} fontSize={numFontSize} lineHeight={numLineHeight} weight="bold" />
      </Box>
    );
  };

  // Measure and scale to fit if big timer would overflow
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [contentWidth, setContentWidth] = React.useState(0);
  const scale = isBig && containerWidth > 0 && contentWidth > 0 ? Math.min(1, containerWidth / contentWidth) : 1;

  return (
    <View
      testID={testID}
      className="flex-row items-center"
      style={[{ width: '100%' }, style as any]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={{ transform: [{ scale }], transformOrigin: 'left center' as any }}>
        <View className="flex-row items-center" onLayout={(e) => setContentWidth(e.nativeEvent.layout.width)}>
          {shouldShowDays ? (
            <>
              {renderUnit('days', state.days)}
              <Colon variant={variant} size={size} />
            </>
          ) : null}
          {renderUnit('hours', state.hours)}
          <Colon variant={variant} size={size} />
          {renderUnit('minutes', state.minutes)}
          <Colon variant={variant} size={size} />
          {renderUnit('seconds', state.seconds)}
        </View>
      </View>
    </View>
  );
}

export default { Timer };


