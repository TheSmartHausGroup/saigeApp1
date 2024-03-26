// src/components/Message.tsx
import React from 'react';
import { MessageDto } from "../models/MessageDto";

const Message: React.FC<{ message: MessageDto }> = ({ message }) => {
  const alignment = message.isUser ? "right" : "left";
  const messageStyles = {
    textAlign: alignment as 'right' | 'left',
    margin: "8px",
  };
  const bubbleStyles = {
    color: message.isUser ? "#ffffff" : "#000000",
    backgroundColor: message.isUser ? "#1186fe" : "#eaeaea",
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
