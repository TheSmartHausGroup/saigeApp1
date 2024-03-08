// src/models/MessageDto.ts

export type MessageType = 'text' | 'transcription';

export class MessageDto {
  id: string; // Unique identifier for each message
  isUser: boolean; // Indicates if the message is from the user
  content: string; // Content of the message
  type: MessageType; // Type of the message: 'text' or 'transcription'
  timestamp?: Date; // Optional: Capture when the message was created or received
  status?: 'pending' | 'sent' | 'received' | 'error'; // Optional: Track the status of the message

  constructor(id: string, isUser: boolean, content: string, type: MessageType, timestamp?: Date, status?: 'pending' | 'sent' | 'received' | 'error') {
    this.id = id;
    this.isUser = isUser;
    this.content = content;
    this.type = type; // Assign the type of message
    this.timestamp = timestamp;
    this.status = status;
  }
}
