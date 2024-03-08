import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { MessageDto } from '../models/MessageDto';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

const Chat = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>([]);
  const [input, setInput] = useState<string>("");

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    setMessages([new MessageDto(uuidv4(), false, "How can I help you today?", 'text')]);
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      const newMessage = new MessageDto(uuidv4(), true, input, 'text');
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput("");

      setIsWaiting(true); // Start waiting
      try {
        await fetch(`${apiEndpoint}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsWaiting(false); // Stop waiting regardless of success or failure
      }
    }
  };

  const sendAudioChunk = async (audioBlob: Blob) => {
    setIsWaiting(true); // Start waiting
    try {
      await fetch(`${apiEndpoint}/sendAudioChunk`, {
        method: "POST",
        body: audioBlob,
        headers: {
          "Content-Type": "audio/wav",
        },
      });
    } catch (error) {
      console.error("Failed to send audio chunk:", error);
    } finally {
      setIsWaiting(false); // Stop waiting
    }
  };

  const onSendEmail = async () => {
    const messageContent = messages.map(msg => msg.content).join("\n");
    setIsWaiting(true); // Start waiting
    try {
      await fetch(`${apiEndpoint}/sendEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: messageContent }),
      });
      console.log("Email sent successfully.");
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setIsWaiting(false); // Stop waiting
    }
  };

  return (
    <Container>
      <MessageList messages={messages} />
      <ChatInput
        input={input}
        isWaiting={isWaiting}
        onInputChange={(e) => setInput(e.target.value)}
        onSendMessage={handleSendMessage}
        sendAudioChunk={sendAudioChunk}
        onSendEmail={onSendEmail}
      />
    </Container>
  );
};

export default Chat;
