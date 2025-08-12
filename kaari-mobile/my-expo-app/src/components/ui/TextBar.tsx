import { View, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { Icon } from './Icon';

export function TextBar({ placeholder = 'Write a message...', onSend }: { placeholder?: string; onSend?: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <View className="flex-row items-center bg-white border border-gray100 rounded-full px-3 py-2">
      <TextInput
        placeholder={placeholder}
        value={text}
        onChangeText={setText}
        className="flex-1 px-2"
        placeholderTextColor="#9CA3AF"
      />
      <Pressable
        onPress={() => {
          if (text.trim().length === 0) return;
          onSend?.(text);
          setText('');
        }}
        className="p-1"
      >
        <Icon name="send" width={20} height={20} fill="#8F27CE" />
      </Pressable>
    </View>
  );
}


