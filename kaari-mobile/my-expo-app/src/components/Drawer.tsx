import React from 'react';
import { Dimensions, PanResponder, Pressable, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import CloseIcon from '../../assets/Icon_Cross.svg';

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  height?: number;            // expanded stop height (px)
  collapsedHeight?: number;   // collapsed stop height (px)
  maxTopOffset?: number;      // minimum distance from top when fully expanded; defaults to safe area + 8
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  showHandle?: boolean;
  showClose?: boolean;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

const springCfg = { damping: 26, stiffness: 200, overshootClamping: true } as const;

export function Drawer({
  open,
  onOpenChange,
  height = 420,
  collapsedHeight,
  maxTopOffset,
  header,
  footer,
  children,
  showHandle = true,
  showClose = true,
  onAfterOpen,
  onAfterClose,
  style,
  testID,
}: DrawerProps) {
  const winH = Dimensions.get('window').height;
  const winW = Dimensions.get('window').width;
  const insets = useSafeAreaInsets();
  const topGap = Math.max(0, maxTopOffset ?? insets.top + 8);
  const footerBottomPad = 48 + insets.bottom;
  const handleBlockH = showHandle ? 14 : 0; // 6px handle + 8px top margin

  // Natural (unconstrained) content height measured off-screen
  const [naturalH, setNaturalH] = React.useState(0);

  // Animated state
  const overlayAlpha = useSharedValue(0);
  const panelH = useSharedValue(0); // panel height in px

  // Derived stops
  const collapsedH = Math.max(0, collapsedHeight ?? height);
  const expandedH = Math.max(0, height);
  // Allow expanding beyond the screen edge (no top clamp)
  const fullH = Math.max(expandedH, naturalH);
  const fullHRef = React.useRef(fullH);
  React.useEffect(() => {
    fullHRef.current = fullH;
  }, [fullH]);

  // Open/close reactions
  React.useEffect(() => {
    if (open) {
      overlayAlpha.value = withTiming(1, { duration: 200 });
      // Start from collapsed if provided, else expanded
      const startH = collapsedHeight ? collapsedH : expandedH;
      panelH.value = withSpring(startH, springCfg, (done) => {
        if (done && onAfterOpen) runOnJS(onAfterOpen)();
      });
    } else {
      overlayAlpha.value = withTiming(0, { duration: 200 });
      panelH.value = withTiming(0, { duration: 240 }, (done) => {
        if (done && onAfterClose) runOnJS(onAfterClose)();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, height, collapsedHeight, naturalH, topGap]);

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayAlpha.value }));
  const panelStyle = useAnimatedStyle(() => ({
    height: panelH.value,
    transform: [{ translateY: winH - panelH.value }],
  }));

  // Drag to resize (expand/collapse/close)
  const startH = React.useRef(0);
  const pan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        startH.current = panelH.value as number;
      },
      onPanResponderMove: (_, g) => {
        // Up drag -> increase height; down drag -> decrease height
        const desired = startH.current - g.dy;
        const clamped = Math.max(0, Math.min(fullHRef.current, desired));
        panelH.value = clamped;
        // Keep backdrop fully visible when overshooting upward
        // progress > 0 when moving down from expandedY; <= 0 when overshooting upward
        const winHNow = Dimensions.get('window').height;
        const expandedY = Math.max(0, winHNow - height);
        const currentY = winHNow - clamped;
        const progress = (currentY - expandedY) / 200;
        const clampedProgress = Math.max(0, Math.min(1, progress));
        overlayAlpha.value = 1 - clampedProgress;
      },
      onPanResponderRelease: (_, g) => {
        const maxStop = fullHRef.current;
        const curr = panelH.value as number;
        const goingDown = g.vy > 0.35 || g.dy > 14;

        if (goingDown) {
          // From expanded/full: always settle at collapsed first, not close directly
          if (startH.current > collapsedH + 10) {
            panelH.value = withSpring(collapsedH, springCfg);
            overlayAlpha.value = withTiming(1, { duration: 120 });
            return;
          }
          // Already near collapsed: allow close on strong downward gesture or small height
          const shouldClose = g.vy > 1.6 || curr < collapsedH * 0.6;
          if (shouldClose) {
            overlayAlpha.value = withTiming(0, { duration: 140 }, () => runOnJS(onOpenChange)(false));
            panelH.value = withTiming(0, { duration: 200 });
            return;
          }
          // Otherwise snap to collapsed
          panelH.value = withSpring(collapsedH, springCfg);
          overlayAlpha.value = withTiming(1, { duration: 120 });
          return;
        }

        // Going up or release without significant downward intent -> snap to nearest higher stop
        const stops = collapsedHeight ? [collapsedH, expandedH, maxStop] : [expandedH, maxStop];
        let best = stops[0];
        let bestD = Math.abs(curr - best);
        for (let i = 1; i < stops.length; i++) {
          const d = Math.abs(curr - stops[i]);
          if (d < bestD) { bestD = d; best = stops[i]; }
        }
        panelH.value = withSpring(best, springCfg);
        overlayAlpha.value = withTiming(1, { duration: 120 });
      },
    })
  ).current;

  return (
    <View pointerEvents={open ? 'auto' : 'none'} style={{ position: 'absolute', inset: 0 as unknown as number, zIndex: 9999, elevation: 9999 }}>
      {/* Backdrop */}
      <Animated.View testID={testID ? `${testID}-overlay` : undefined} style={[{ position: 'absolute', inset: 0 as unknown as number, backgroundColor: 'rgba(0,0,0,0.5)' }, overlayStyle]}>
        <Pressable style={{ flex: 1 }} onPress={() => onOpenChange(false)} />
      </Animated.View>

      {/* Panel */}
      <Animated.View testID={testID} {...pan.panHandlers} style={[{ position: 'absolute', left: 0, right: 0, backgroundColor: colors.white, borderTopLeftRadius: 16, borderTopRightRadius: 16 }, panelStyle, style as any]}>
        {/* Handle + close */}
        <View className="items-center">
          {showHandle ? <View style={{ width: 44, height: 6, borderRadius: 3, backgroundColor: '#D9D9D9', marginTop: 8 }} /> : null}
        </View>
        {showClose ? (
          <Pressable accessibilityRole="button" onPress={() => onOpenChange(false)} style={{ position: 'absolute', top: 12, right: 12, padding: 6 }}>
            <CloseIcon width={20} height={20} color={colors.primary} stroke={colors.primary} />
          </Pressable>
        ) : null}

        {/* Visible content (no scrolling; panel grows instead) */}
        {header ? <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>{header}</View> : null}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>{children}</View>
        {footer ? <View style={{ paddingHorizontal: 16, paddingBottom: footerBottomPad }}>{footer}</View> : null}
      </Animated.View>

      {/* Offscreen measurement to compute natural content height (header + body + footer) */}
      {open ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: -10000, top: -10000, width: winW }}
          onLayout={(e) => setNaturalH(e.nativeEvent.layout.height)}
        >
          {showHandle ? <View style={{ height: handleBlockH }} /> : null}
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>{header}</View>
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>{children}</View>
          <View style={{ paddingHorizontal: 16, paddingBottom: footerBottomPad }}>{footer}</View>
        </View>
      ) : null}
    </View>
  );
}

export default { Drawer };

