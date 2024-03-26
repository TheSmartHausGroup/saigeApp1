import React, { useEffect, useState } from 'react';
import Message from './Message'; // Assuming this component displays individual messages
import { MessageDto } from '../models/MessageDto'; // Assuming this is your data model for messages

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Array<MessageDto>>([]);

  useEffect(() => {
    // Placeholder for loading initial messages or setting up WebSocket listeners
    // For demonstration, adding a welcome message
    setMessages([
      ...messages,
      new MessageDto('welcome-id', false, 'Welcome to sAIge chat!', 'text'),
    ]);
  }, []);

  // Function to add messages to the chat, can be expanded or modified as needed
  const addMessageToChat = (newMessage: MessageDto) => {
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="chat-container">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Chat;
