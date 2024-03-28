// Defines a TypeScript type for the allowed message types. This can help ensure that messages
// are only created with valid types in the system.
export type MessageType = 'text' | 'transcription';

// Defines the MessageDto class that models the data structure for a chat message.
export class MessageDto {
  id: string; // A unique identifier for each message. Useful for tracking and managing messages.
  isUser: boolean; // Indicates if the message was sent by the user. This can help differentiate between user messages and system or bot messages.
  content: string; // The actual content of the message. This is the text or transcription that will be displayed.
  type: MessageType; // Specifies the type of the message. It uses the MessageType type to restrict values to either 'text' or 'transcription'.
  timestamp?: Date; // An optional timestamp indicating when the message was created or received. Marked as optional with '?'.
  status?: 'pending' | 'sent' | 'received' | 'error'; // An optional property to track the delivery status of the message. It's useful for UI indications of message state.

  // Constructor for the MessageDto class. Initializes a new instance with the provided values.
  // Parameters mirror the properties of the class. The timestamp and status parameters are optional.
  constructor(id: string, isUser: boolean, content: string, type: MessageType, timestamp?: Date, status?: 'pending' | 'sent' | 'received' | 'error') {
    this.id = id; // Assigns the unique identifier.
    this.isUser = isUser; // Sets whether the message is from the user.
    this.content = content; // Sets the content of the message.
    this.type = type; // Assigns the type of the message, ensuring it matches the MessageType definition.
    this.timestamp = timestamp; // Sets the timestamp, if provided.
    this.status = status; // Sets the message status, if provided.
  }
}
