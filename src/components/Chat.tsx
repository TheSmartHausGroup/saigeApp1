import React, { useEffect, useRef } from 'react'; // Imports useEffect for side effects in functional components, and useRef to reference DOM elements.
import MessageList from './MessageList'; // Importing the MessageList component to display the list of messages.
import { MessageDto } from '../models/MessageDto'; // Importing the MessageDto model to type the messages props.
import { Theme } from '../components/colorScheme'; // Importing the Theme type for theming support.

// Defines the props for the Chat component, including an array of MessageDto and a Theme object.
interface ChatProps {
  messages: MessageDto[];
  theme: Theme; // Adding theme to the component's props for styling.
}

// The Chat functional component, deconstructed to directly use `messages` and `theme` from props.
const Chat: React.FC<ChatProps> = ({ messages, theme }) => {
  // Using useRef to reference the div at the end of the messages list for auto-scrolling.
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  // useEffect hook to auto-scroll to the latest message every time the `messages` array updates.
  useEffect(() => {
    if (endOfMessagesRef.current) { // Checks if the ref is correctly attached to a DOM element.
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" }); // Auto-scrolls to the referenced div element smoothly.
    }
  }, [messages]); // Dependency array includes `messages` to trigger the effect on update.

  // Render function for the Chat component.
  return (
    <div className="chat-container" style={{
      color: theme.textColor, // Dynamically sets the text color from the theme.
      backgroundColor: theme.isImage ? `url(${theme.backgroundColor})` : theme.backgroundColor, // Conditionally sets a background image or color based on the theme.
      // You can apply other theme styles as needed here.
    }}> 
      <div className="chat-messages">
        <MessageList messages={messages} theme={theme} /> {/* Renders the MessageList component, passing it the `messages` and `theme` props. */}
        <div ref={endOfMessagesRef} /> {/* Invisible div for auto-scrolling to the latest message. */}
      </div>
    </div>
  );
};

export default Chat; // Exports the Chat component for use in other parts of the application.
