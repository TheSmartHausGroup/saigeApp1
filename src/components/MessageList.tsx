// src/components/MessageList.tsx
import React from 'react';
import { MessageDto } from '../models/MessageDto';
import Message from './Message';
import { Theme } from '../components/colorScheme'; // Ensure this import is correct

interface MessageListProps {
  messages: Array<MessageDto>;
  theme: Theme; // Add theme prop
}

const MessageList: React.FC<MessageListProps> = ({ messages, theme }) => {
  return (
    <div className="messageWindow">
      {messages.map((message) => (
        <Message key={message.id} message={message} theme={theme} /> // Pass theme to each Message
      ))}
    </div>
  );
};

export default MessageList;