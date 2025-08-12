import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

type TimerVariant = 'labeled' | 'compactLight' | 'compactAccent';

type Props = {
  /** Target timestamp in ms, or seconds if isSeconds=true */
  target: number;
  isSeconds?: boolean;
  variant?: TimerVariant;
  showDays?: boolean;
  style?: string;
};

function formatTwo(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function Separator({ variant }: { variant: TimerVariant }) {
  const color = variant === 'compactAccent' ? 'text-primary' : 'text-white';
  const size = variant === 'labeled' ? 'text-3xl' : 'text-2xl';
  const mx = variant === 'labeled' ? 'mx-0.5' : 'mx-1';
  return <Text className={`${color} ${size} font-extrabold ${mx}`}>:</Text>;
}

function Unit({
  value,
  label,
  variant,
}: {
  value: string;
  label?: string;
  variant: TimerVariant;
}) {
  if (variant === 'labeled') {
    return (
      <View className="items-center">
        <BlurView intensity={30} tint="light" style={{ borderRadius: 20, overflow: 'hidden' }}>
          <View className="bg-white/20 border border-white/20 rounded-2xl px-5 py-4 min-w-[64px] items-center">
            <Text className="text-white text-4xl font-extrabold">{value}</Text>
          </View>
        </BlurView>
        <Text className="text-white/90 text-sm mt-2">{label}</Text>
      </View>
    );
  }
  const baseCls = 'rounded-2xl px-4 py-3 min-w-[64px] items-center';
  const wrapCls = variant === 'compactAccent' ? `bg-primaryLight/60 ${baseCls}` : `bg-gray200 ${baseCls}`;
  const textCls = variant === 'compactAccent' ? 'text-primary text-3xl font-extrabold' : 'text-white text-3xl font-extrabold';
  return (
    <View className={wrapCls}>
      <Text className={textCls}>{value}</Text>
    </View>
  );
}

export function Timer({ target, isSeconds, variant = 'labeled', showDays = true, style }: Props) {
  const targetMs = useMemo(() => (isSeconds ? target * 1000 : target), [target, isSeconds]);
  const [now, setNow] = useState(Date.now());
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setNow(Date.now());
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  let diff = Math.max(0, targetMs - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const gapClass = variant === 'labeled' ? 'gap-1' : 'gap-2';
  return (
    <View className={`flex-row items-center ${gapClass} ${style ?? ''}`}>
      {showDays ? (
        <>
          <Unit value={`${days}`} label="Days" variant={variant} />
          <Separator variant={variant} />
        </>
      ) : null}
      <Unit value={formatTwo(hours)} label={variant === 'labeled' ? 'Hours' : undefined} variant={variant} />
      <Separator variant={variant} />
      <Unit value={formatTwo(minutes)} label={variant === 'labeled' ? 'Minutes' : undefined} variant={variant} />
      <Separator variant={variant} />
      <Unit value={formatTwo(seconds)} label={variant === 'labeled' ? 'Seconds' : undefined} variant={variant} />
    </View>
  );
}


