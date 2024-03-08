// src/components/Message.tsx
import React from 'react';
import { MessageDto } from "../models/MessageDto";

const Message: React.FC<{ message: MessageDto }> = ({ message }) => {
  // Determine message alignment for visual differentiation
  const alignment = message.isUser ? "right" : "left";
  // Prepare styles for conditional rendering
  const messageStyles = {
    textAlign: alignment as 'right' | 'left',
    margin: "8px",
  };
  const bubbleStyles = {
    color: message.isUser ? "#ffffff" : "#000000",
    backgroundColor: message.isUser ? "#1186fe" : "#eaeaea",
    padding: "15px",
    borderRadius: "8px",
    display: 'inline-block', // Ensure the bubble size matches the content
  };

  return (
    <div style={messageStyles}>
      <div style={bubbleStyles} aria-label={`Message from ${message.isUser ? "you" : "them"}`}>
        {/* Splitting message content for better formatting */}
        {message.content.split("\n").map((text, index) => (
          <React.Fragment key={index}>
            {text}
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Message;
