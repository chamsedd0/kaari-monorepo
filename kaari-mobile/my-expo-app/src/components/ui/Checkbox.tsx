import { Pressable, View } from 'react-native';

export function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onChange(!checked)} className={`w-5 h-5 rounded-md border ${checked ? 'bg-black border-black' : 'border-gray-300'}`}>
      {checked ? <View className="w-full h-full items-center justify-center" /> : null}
    </Pressable>
  );
}


