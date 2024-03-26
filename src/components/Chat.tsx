import React, { useEffect, useRef } from 'react';
import Message from './Message'; // Ensure this import path is correct
import { MessageDto } from '../models/MessageDto'; // Ensure this import path is correct

interface ChatProps {
  messages: MessageDto[];
}

const Chat: React.FC<ChatProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null); // Reference to an empty div at the end of the messages

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This effect runs every time the messages array changes

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {/* Invisible element at the end of the messages to scroll to */}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Chat;
