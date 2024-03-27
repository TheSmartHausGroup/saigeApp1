import React, { useEffect, useRef } from 'react';
import MessageList from './MessageList'; // Import MessageList instead of Message
import { MessageDto } from '../models/MessageDto';

interface ChatProps {
  messages: MessageDto[];
}

const Chat: React.FC<ChatProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-messages">
      <MessageList messages={messages} />
      <div ref={endOfMessagesRef} /> {/* Keeps the scroll to bottom functionality */}
    </div>
  );
};

export default Chat;
