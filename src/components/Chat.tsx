import React, { useEffect, useRef } from 'react';
import MessageList from './MessageList'; // Ensure this import is correct
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
    <div className="chat-container"> {/* Added class for the Chat container */}
      <div className="chat-messages">
        <MessageList messages={messages} />
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default Chat;
