import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

export default function ChatMessages({ messages, hintsVisible, isWaiting, onUsePrompt }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaiting]);

  return (
    <div className="messages">
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          role={msg.role}
          text={msg.text}
          prompts={msg.prompts}
          hintsVisible={hintsVisible}
          onUsePrompt={onUsePrompt}
        />
      ))}
      <TypingIndicator visible={isWaiting} />
      <div ref={bottomRef} />
    </div>
  );
}
