// src/components/MessageList.tsx
import React from 'react';
import { MessageDto } from '../models/MessageDto';
import Message from './Message';

interface MessageListProps {
  messages: Array<MessageDto>;
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="messageWindow">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
