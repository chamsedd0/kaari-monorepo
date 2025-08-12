import { useState } from 'react';
import { Pressable } from 'react-native';
import { Icon } from './Icon';

export function LikeButton({ defaultLiked = false }: { defaultLiked?: boolean }) {
  const [liked, setLiked] = useState(defaultLiked);
  return (
    <Pressable onPress={() => setLiked((v) => !v)} className="w-10 h-10 rounded-full items-center justify-center bg-white/90">
      <Icon name="favorites" width={20} height={20} fill={liked ? '#EF4444' : '#000'} />
    </Pressable>
  );
}


