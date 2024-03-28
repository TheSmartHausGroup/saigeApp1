// src/components/Message.tsx
import React from 'react';
import { MessageDto } from "../models/MessageDto";
import { Theme } from '../components/colorScheme'; // Adjust the import path as necessary

interface MessageProps {
  message: MessageDto;
  theme: Theme;
}

const Message: React.FC<MessageProps> = ({ message, theme }) => {
  const alignment = message.isUser ? "right" : "left";
  const messageStyles = {
    textAlign: alignment as 'right' | 'left',
    margin: "8px",
  };

  // Use theme properties for styling message bubbles
  const bubbleStyles = {
    color: theme.textColor, // Text color from theme
    backgroundColor: message.isUser ? theme.messageBubbleColor : theme.chatInputBgColor, // Background color based on user
    padding: "15px",
    borderRadius: "8px",
    display: 'inline-block',
  };

  return (
    <div style={messageStyles}>
      <div style={bubbleStyles}>
        {message.content.split("\n").map((text, index) => (
          <React.Fragment key={index}>
            {text}<br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Message;