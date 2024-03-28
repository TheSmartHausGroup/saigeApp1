import React, { useEffect, useRef } from 'react'; // Importing React, useEffect for side effects, useRef for accessing DOM elements.
import MessageList from './MessageList'; // Importing the component to display a list of messages.
import { MessageDto } from '../models/MessageDto'; // Importing the data model for messages.
import { Theme } from '../components/colorScheme'; // Importing the Theme interface for theming support.

// Interface defining the props for the Chat component.
interface ChatProps {
  messages: MessageDto[]; // Array of messages to display.
  theme: Theme; // Current theme settings.
}

const Chat: React.FC<ChatProps> = ({ messages, theme }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null); // Ref for auto-scrolling to the newest message.

  useEffect(() => { // Hook to scroll to the bottom of the chat when new messages arrive.
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" }); // Smoothly scrolls to the element referenced by endOfMessagesRef.
  }, [messages]); // Dependency array, effect runs when the messages array changes.

  return (
    <div className="chat-container" style={{
      color: theme.textColor, // Sets the text color based on the current theme.
      backgroundColor: theme.isImage ? 'transparent' : theme.backgroundColor, // Sets background color or makes it transparent if using an image.
      backgroundImage: theme.isImage ? `url(${theme.backgroundColor})` : 'none', // Sets the background image if specified by the theme.
      backgroundSize: 'cover', // Ensures the background image covers the entire area.
      backgroundPosition: 'center', // Centers the background image.
    }}>
      <div className="chat-messages">
        <MessageList messages={messages} theme={theme} /> {/* Renders the list of messages.*/}
        <div ref={endOfMessagesRef} /> {/* Invisible div used for auto-scrolling to the bottom of the chat.*/}
      </div>
    </div>
  );
};

export default Chat; // Exports the Chat component.
