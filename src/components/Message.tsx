import React from 'react'; // Imports the React library to use JSX and functional components.
import { MessageDto } from "../models/MessageDto"; // Imports the MessageDto type for strong typing of the message prop.
import { Theme } from '../components/colorScheme'; // Ensures the correct import path for the Theme interface for styling.

// Defines the props expected by the Message component, including a single message and the theme for styling.
interface MessageProps {
  message: MessageDto; // The message object containing content, sender information, etc.
  theme: Theme; // The theme object for applying dynamic styles based on the current theme.
}

// Functional component definition accepting MessageProps. Destructures props for direct access to message and theme.
const Message: React.FC<MessageProps> = ({ message, theme }) => {
  const alignment = message.isUser ? "right" : "left"; // Determines text alignment based on whether the message was sent by the user.
  // Styles for the outer div that aligns the message bubble left or right.
  const messageStyles = {
    textAlign: alignment as 'right' | 'left', // Ensures TypeScript understands the alignment values are limited to 'right' or 'left'.
    margin: "8px", // Adds a margin around each message for spacing.
  };

  // Dynamic styles for the message bubble, utilizing the theme for colors and adding padding and rounded corners for appearance.
  const bubbleStyles = {
    color: theme.textColor, // Applies the text color from the theme to the message text.
    backgroundColor: message.isUser ? theme.userMessageBubbleColor : theme.chatInputBgColor, // Background color changes based on whether the message is from the user or not, using theme colors.
    padding: "15px", // Adds padding inside the bubble for spacing around the text.
    borderRadius: "8px", // Rounds the corners of the bubble for a modern, chat-like appearance.
    display: 'inline-block', // Makes the bubble size according to its content while allowing it to be aligned by textAlign.
  };

  // Returns JSX for the message component, splitting the message content by newline characters and rendering each part with a <br /> for proper formatting.
  return (
    <div style={messageStyles}> // Applies alignment styles to this wrapper div.
      <div style={bubbleStyles}> // Applies bubble styling to this inner div.
        {message.content.split("\n").map((text, index) => ( // Splits message content at newline characters and maps over each line.
          <React.Fragment key={index}> // Uses React.Fragment to avoid adding unnecessary DOM elements, with a key for React's list rendering requirements.
            {text}<br /> // Displays a line of text followed by a line break.
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Message; // Exports the Message component for use elsewhere in the application.
