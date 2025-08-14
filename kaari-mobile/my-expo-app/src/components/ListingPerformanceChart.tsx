import React from 'react';
import { PanResponder, View, ViewStyle } from 'react-native';
import Svg, { G, Line as SvgLine, Path, Circle, Text as SvgText, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { VText } from './typography';

export type ListingPerformanceChartProps = {
  labels: string[]; // x-axis labels, length N
  views: number[]; // series A length N
  clicks: number[]; // series B length N
  bookings: number[]; // series C length N
  style?: ViewStyle | ViewStyle[];
  testID?: string;
  height?: number; // chart drawing height
  showLegend?: boolean; // deprecated; not used anymore
  emptyMessage?: string;
  title?: string;
  periodLabel?: string;
  totals?: { views?: number; clicks?: number; bookings?: number };
};

// Helper to build an SVG path for a polyline
function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  const cmds: string[] = [`M ${first.x} ${first.y}`];
  for (const p of rest) {
    cmds.push(`L ${p.x} ${p.y}`);
  }
  return cmds.join(' ');
}

// Smooth (Catmull–Rom) polyline to cubic Bezier path
function buildSmoothPath(points: { x: number; y: number }[], tension = 0.5): string {
  const n = points.length;
  if (n === 0) return '';
  if (n < 3) return buildPath(points);
  const p = (i: number) => points[Math.max(0, Math.min(n - 1, i))];
  const d: string[] = [`M ${p(0).x} ${p(0).y}`];
  for (let i = 0; i < n - 1; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;
    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(' ');
}

export function ListingPerformanceChart({ labels, views, clicks, bookings, style, testID, height = 180, showLegend = false, emptyMessage = 'No data yet', title = 'Listing Performance', periodLabel }: ListingPerformanceChartProps) {
  const [width, setWidth] = React.useState(0);
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const [zoomScale, setZoomScale] = React.useState(1);
  const [zoomOffset, setZoomOffset] = React.useState(0);
  const pinchBase = React.useRef({ dist: 0, scale: 1, offset: 0 });

  const N = Math.max(labels.length, views.length, clicks.length, bookings.length);
  const safe = (arr: number[]) => Array.from({ length: N }, (_, i) => (Number.isFinite(arr[i]) ? arr[i] : 0));
  const sViews = safe(views);
  const sClicks = safe(clicks);
  const sBookings = safe(bookings);

  const maxVal = Math.max(1, ...sViews, ...sClicks, ...sBookings);
  const hasData = maxVal > 0 && (sViews.some(v => v > 0) || sClicks.some(v => v > 0) || sBookings.some(v => v > 0));

  const paddingLeft = 0;
  const paddingRight = 0;
  const paddingTop = 0;
  const paddingBottom = 0;

  const chartW = Math.max(0, width - paddingLeft - paddingRight);
  const chartH = Math.max(0, height - paddingTop - paddingBottom);

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }
  function visibleSpan() {
    return (N - 1) / zoomScale;
  }
  function startIndex() {
    return clamp(zoomOffset, 0, Math.max(0, N - 1 - visibleSpan()));
  }
  function xFor(i: number) {
    if (N <= 1) return paddingLeft + chartW / 2;
    const t = (i - startIndex()) / (visibleSpan() || 1);
    return paddingLeft + t * chartW;
  }
  function yFor(v: number) {
    const t = v / maxVal; // 0..1 up -> higher y
    return paddingTop + (1 - t) * chartH;
  }

  const pViews = sViews.map((v, i) => ({ x: xFor(i), y: yFor(v) }));
  const pClicks = sClicks.map((v, i) => ({ x: xFor(i), y: yFor(v) }));
  const pBookings = sBookings.map((v, i) => ({ x: xFor(i), y: yFor(v) }));

  const gridLines = 0; // no grid per spec

  // gestures: pan to hover + horizontal glide, pinch to zoom
  const pan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gs) => {
        const touches = (evt.nativeEvent as any).touches || [];
        if (touches.length >= 2) {
          const [a, b] = touches;
          const dx = a.pageX - b.pageX;
          const dy = a.pageY - b.pageY;
          pinchBase.current = { dist: Math.hypot(dx, dy), scale: zoomScale, offset: zoomOffset };
        }
        const lx = (evt.nativeEvent as any).locationX as number;
        const idx = Math.round(startIndex() + (clamp((lx - paddingLeft) / (chartW || 1), 0, 1)) * visibleSpan());
        setHoverIdx(clamp(idx, 0, N - 1));
      },
      onPanResponderMove: (evt, gs) => {
        const touches = (evt.nativeEvent as any).touches || [];
        if (touches.length >= 2) {
          const [a, b] = touches;
          const dx = a.pageX - b.pageX;
          const dy = a.pageY - b.pageY;
          const dist = Math.hypot(dx, dy);
          const base = pinchBase.current;
          const s = clamp(base.scale * (dist / (base.dist || 1)), 1, 4);
          setZoomScale(s);
        } else {
          const lx = (evt.nativeEvent as any).locationX as number;
          const idx = Math.round(startIndex() + (clamp((lx - paddingLeft) / (chartW || 1), 0, 1)) * visibleSpan());
          setHoverIdx(clamp(idx, 0, N - 1));
          if (Math.abs(gs.dx) > 2) {
            const deltaIdx = (gs.dx / (chartW || 1)) * visibleSpan() * -1;
            const next = clamp(pinchBase.current.offset + deltaIdx, 0, Math.max(0, N - 1 - visibleSpan()));
            setZoomOffset(next);
          }
        }
      },
      onPanResponderRelease: () => {
        pinchBase.current.offset = zoomOffset;
        pinchBase.current.scale = zoomScale;
      },
    })
  ).current;

  const totalsViews = views.reduce((a, b) => a + (b || 0), 0);
  const totalsClicks = clicks.reduce((a, b) => a + (b || 0), 0);
  const totalsBookings = bookings.reduce((a, b) => a + (b || 0), 0);

  return (
    <View testID={testID} className="rounded-2xl bg-white" style={[{ paddingTop: 12, overflow: 'hidden', borderRadius: 16 }, style as any]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {/* Header */}
      <View className="mb-2 px-4">
        <VText className="text-[16px] leading-[16px]" weight="bold" style={{ color: colors.gray700 }}>{title}</VText>
        {periodLabel ? (
          <VText className="text-[12px] leading-[12px] mt-1" weight="medium" style={{ color: colors.gray500 }}>{periodLabel}</VText>
        ) : null}
      </View>
      {hasData ? (
        <View className="flex-row items-end justify-center gap-2">
          <Metric value={totalsViews} color={colors.primary} label="Views" />
          <Metric value={totalsClicks} color={colors.info} label="Clicks" />
          <Metric value={totalsBookings} color={colors.success} label="Bookings" />
        </View>
      ) : (
        <View style={{ height: 28 }} />
      )}
      <View style={{ height }}>
        {width > 0 ? (
          <Svg width={width} height={height} {...pan.panHandlers}>
            {/* No grid lines */}
            {/* Series */}
            {hasData ? (
              <G>
                {/* Area fills */}
                <Path d={`${buildSmoothPath(pViews)} L ${pViews[pViews.length-1]?.x ?? paddingLeft} ${paddingTop + chartH} L ${pViews[0]?.x ?? paddingLeft} ${paddingTop + chartH} Z`} fill={`${colors.primary}40`} stroke="none" />
                <Path d={`${buildSmoothPath(pClicks)} L ${pClicks[pClicks.length-1]?.x ?? paddingLeft} ${paddingTop + chartH} L ${pClicks[0]?.x ?? paddingLeft} ${paddingTop + chartH} Z`} fill={`${colors.info}40`} stroke="none" />
                <Path d={`${buildSmoothPath(pBookings)} L ${pBookings[pBookings.length-1]?.x ?? paddingLeft} ${paddingTop + chartH} L ${pBookings[0]?.x ?? paddingLeft} ${paddingTop + chartH} Z`} fill={`${colors.success}40`} stroke="none" />
                {/* Lines */}
                <Path d={buildSmoothPath(pViews)} stroke={colors.primary} strokeWidth={3} fill="none" />
                {pViews.map((p, i) => (
                  <Circle key={`pv-${i}`} cx={p.x} cy={p.y} r={3} fill={colors.primary} />
                ))}
                <Path d={buildSmoothPath(pClicks)} stroke={colors.info} strokeWidth={3} fill="none" />
                {pClicks.map((p, i) => (
                  <Circle key={`pc-${i}`} cx={p.x} cy={p.y} r={3} fill={colors.info} />
                ))}
                <Path d={buildSmoothPath(pBookings)} stroke={colors.success} strokeWidth={3} fill="none" />
                {pBookings.map((p, i) => (
                  <Circle key={`pb-${i}`} cx={p.x} cy={p.y} r={3} fill={colors.success} />
                ))}
              </G>
            ) : (
              <G>
                <SvgText x={width / 2} y={height / 2} fontSize={12} fill={colors.gray500} textAnchor="middle">
                  {emptyMessage}
                </SvgText>
                {/* subtle stacked bands */}
                <Rect x={paddingLeft} y={height - 56} width={width - paddingLeft - paddingRight} height={12} rx={6} fill={`${colors.primary}40`} />
                <Rect x={paddingLeft} y={height - 40} width={width - paddingLeft - paddingRight} height={12} rx={6} fill={`${colors.info}40`} />
                <Rect x={paddingLeft} y={height - 24} width={width - paddingLeft - paddingRight} height={12} rx={6} fill={`${colors.success}40`} />
              </G>
            )}
            {/* Tooltip removed per request */}
            
          </Svg>
        ) : null}
      </View>
      {/* bottom legend removed */}
    </View>
  );
}

function LegendDot({ color, label, ring = false }: { color: string; label: string; ring?: boolean }) {
  return (
    <View className="flex-row items-center">
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: ring ? colors.white : color, borderColor: color, borderWidth: 2 }} />
      <VText className="ml-2 text-[12px] leading-[12px]" weight="medium" style={{ color: colors.gray700 }}>
        {label}
      </VText>
    </View>
  );
}

function Metric({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <View className="items-center" style={{ minWidth: 80 }}>
      <VText weight="bold" style={{ color, lineHeight: 40, fontSize: 32 }}>
        {value}
      </VText>
      <VText className="mt-1" weight="medium" style={{ color: colors.gray700, lineHeight: 16, fontSize: 16 }}>
        {label}
      </VText>
    </View>
  );
}

export default { ListingPerformanceChart };


