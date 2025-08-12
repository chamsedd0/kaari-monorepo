import { ReactNode, useEffect, useMemo } from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Optional max height ratio of screen (default 0.85) */
  maxHeightRatio?: number;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function BottomDrawer({ visible, onClose, children, maxHeightRatio = 0.85 }: Props) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdrop = useSharedValue(0);
  const maxHeight = useMemo(() => SCREEN_HEIGHT * maxHeightRatio, [maxHeightRatio]);

  useEffect(() => {
    if (visible) {
      // open
      translateY.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.cubic) });
      backdrop.value = withTiming(1, { duration: 240 });
    } else {
      // close
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 220, easing: Easing.in(Easing.cubic) });
      backdrop.value = withTiming(0, { duration: 220 });
    }
  }, [visible]);

  const onEndClose = () => onClose();

  const gestureHandler = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    const { translationY, velocityY, state } = nativeEvent as any;
    // update position while dragging
    translateY.value = Math.max(0, translationY);

    if (state === 5 /* end */) {
      const shouldClose = translationY > 120 || velocityY > 800;
      if (shouldClose) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, () => runOnJS(onEndClose)());
        backdrop.value = withTiming(0, { duration: 200 });
      } else {
        translateY.value = withTiming(0, { duration: 200 });
      }
    }
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value * 0.6,
  }));

  if (!visible && backdrop.value === 0) {
    // not mounted visually but ensure off-screen style update can run
  }

  return (
    <Animated.View pointerEvents={visible ? 'auto' : 'none'} style={[StyleSheet.absoluteFill, { zIndex: 50 }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }, backdropStyle]} />
      </Pressable>
      <PanGestureHandler onGestureEvent={gestureHandler} onEnded={gestureHandler as any}>
        <Animated.View
          style={[
            sheetStyle,
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight,
              overflow: 'hidden',
            },
          ]}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}


