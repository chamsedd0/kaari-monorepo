import React from 'react';
import { PanResponder, Pressable, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { VText } from './typography';

export type KnobSliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value?: number; // controlled
  defaultValue?: number; // uncontrolled initial
  onChange?: (value: number) => void;
  style?: ViewStyle | ViewStyle[];
  showMinMax?: boolean;
  minLabel?: string;
  maxLabel?: string;
  width?: number | string; // default 100%
};

function clamp(n: number, min: number, max: number) {
  'worklet';
  return Math.max(min, Math.min(max, n));
}

export function KnobSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  style,
  showMinMax,
  minLabel,
  maxLabel,
  width = '100%',
}: KnobSliderProps) {
  const [trackWidth, setTrackWidth] = React.useState(0);
  const [pressed, setPressed] = React.useState(false);
  const [internal, setInternal] = React.useState<number>(
    value !== undefined ? value : defaultValue !== undefined ? defaultValue : min
  );
  const current = value !== undefined ? value : internal;

  React.useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  function valueToX(v: number) {
    const ratio = (v - min) / (max - min);
    return ratio * trackWidth;
  }
  function xToValue(x: number) {
    const ratio = clamp(x, 0, trackWidth) / (trackWidth || 1);
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped, min, max);
  }

  function commit(val: number) {
    if (value === undefined) setInternal(val);
    if (onChange) onChange(val);
  }

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setPressed(true),
      onPanResponderMove: (_, g) => {
        commit(xToValue(g.x0 + g.dx - trackLeft.current));
      },
      onPanResponderRelease: () => setPressed(false),
      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: () => setPressed(false),
    })
  ).current;

  const trackLeft = React.useRef(0);

  const knobSize = 28;
  const half = knobSize / 2;
  const x = valueToX(current);

  return (
    <View style={[{ width }, style as any]}> 
      {showMinMax ? (
        <View className="flex-row justify-between mb-1">
          <VText className="text-[12px] leading-[12px]" weight="medium" style={{ color: colors.gray700 }}>
            {minLabel ?? String(min)}
          </VText>
          <VText className="text-[12px] leading-[12px]" weight="medium" style={{ color: colors.gray700 }}>
            {maxLabel ?? String(max)}
          </VText>
        </View>
      ) : null}

      <View
        className="justify-center"
        style={{ height: 36 }}
        {...panResponder.panHandlers}
      >
        <Pressable
          className="justify-center"
          style={{ height: 12 }}
          onLayout={(e) => {
            setTrackWidth(e.nativeEvent.layout.width);
            trackLeft.current = e.nativeEvent.layout.x;
          }}
          onPress={(e) => {
            const lx = e.nativeEvent.locationX;
            commit(xToValue(lx));
          }}
        >
          {/* Track background */}
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.primaryTint2,
            }}
          />
          {/* Track active */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 3,
              height: 6,
              width: x,
              borderRadius: 3,
              backgroundColor: colors.primary,
            }}
          />
          {/* Knob */}
          <View
            style={{
              position: 'absolute',
              left: Math.max(0, Math.min(x - half, trackWidth - knobSize)),
              top: -8,
              width: knobSize,
              height: knobSize,
              borderRadius: half,
              backgroundColor: colors.white,
              borderWidth: 2,
              borderColor: colors.primary,
              shadowColor: colors.primary,
              shadowOpacity: 0.25,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 0 },
              elevation: 4,
            }}
          />

          {/* Bubble tooltip when pressed */}
          {pressed ? (
            <View
              style={{
                position: 'absolute',
                left: Math.max(0, Math.min(x - 20, trackWidth - 40)),
                bottom: 36,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  backgroundColor: colors.white,
                  borderRadius: 12,
                  borderColor: colors.primary,
                  borderWidth: 2,
                }}
              >
                <VText className="text-[12px] leading-[12px]" weight="medium" style={{ color: colors.gray700 }}>
                  {Math.round(current)}
                </VText>
              </View>
              <View style={{ width: 2, height: 14, backgroundColor: colors.primary }} />
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primaryTint2 }}
                />
              </View>
            </View>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

export default { KnobSlider };


