import { View } from 'react-native';
import { MessageBubble } from '../chat/MessageBubble';

export function Message({ text, mine }: { text: string; mine?: boolean }) {
  return (
    <View>
      <MessageBubble text={text} mine={mine} />
    </View>
  );
}


