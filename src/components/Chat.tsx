import React, { useEffect, useRef } from 'react';
import MessageList from './MessageList'; // Ensure this import is correct
import { MessageDto } from '../models/MessageDto';
import { Theme } from '../components/colorScheme'; // Adjust the import path as necessary

// Adjusting the interface to include a theme prop
interface ChatProps {
  messages: MessageDto[];
  theme: Theme; // Adding theme to the props
}

const Chat: React.FC<ChatProps> = ({ messages, theme }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-container" style={{
      color: theme.textColor, // Using theme's text color
      backgroundColor: theme.isImage ? `url(${theme.backgroundColor})` : theme.backgroundColor, // Applying background color or image
      // Apply other theme styles as needed
    }}> 
      <div className="chat-messages">
        <MessageList messages={messages} theme={theme} /> {/* Pass theme to MessageList if it needs theme */}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default Chat;