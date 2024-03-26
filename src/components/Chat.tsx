import React from 'react';
import Message from './Message'; // Component to display individual messages
import { MessageDto, MessageType } from '../models/MessageDto'; // Correct import of MessageDto

// Prop types for the Chat component
interface ChatProps {
  messages: MessageDto[];
}

const Chat: React.FC<ChatProps> = ({ messages }) => {
  return (
    <div className="chat-container">
      {/* Iterate over messages and render each one */}
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Chat;
