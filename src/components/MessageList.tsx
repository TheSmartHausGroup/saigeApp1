// src/components/MessageList.tsx
import React from 'react'; // Import React to use JSX and functional components.
import { MessageDto } from '../models/MessageDto'; // Import the MessageDto type to define the shape of messages passed to this component.
import Message from './Message'; // Import the Message component to render individual messages.
import { Theme } from '../components/colorScheme'; // Import the Theme type for consistent theming across components.

// Define the properties that MessageList expects to receive. This includes an array of message objects and a theme object.
interface MessageListProps {
  messages: Array<MessageDto>; // An array of messages. Each message is an object defined by the MessageDto type.
  theme: Theme; // A theme object that contains styling properties to be applied to the messages.
}

// Define the MessageList component as a functional component that receives props of type MessageListProps.
const MessageList: React.FC<MessageListProps> = ({ messages, theme }) => {
  // Render a div container that wraps the list of messages.
  return (
    <div className="messageWindow"> {/* The className can be used to apply specific styles to the container of the message list. */}
      {/* Map over the array of messages, transforming each message into a Message component. */}
      {messages.map((message) => (
        // Render a Message component for each message in the array. The key prop helps React identify which items have changed, are added, or are removed.
        <Message key={message.id} message={message} theme={theme} /> // Pass the message object and the theme to each Message component.
      ))}
    </div>
  );
};

export default MessageList; // Export the MessageList component so it can be used in other parts of the application.
