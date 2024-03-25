import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { MessageDto } from '../models/MessageDto';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

const Chat = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Array<MessageDto>>([]);
  const [input, setInput] = useState<string>("");

  // Ensure wsEndpoint and apiEndpoint are defined, providing fallback values as needed.
  // It's crucial that these fallback values are valid URLs to avoid runtime errors.
  const wsEndpoint = process.env.REACT_APP_WS_ENDPOINT || 'wss://fallback.example.com';
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'https://fallback.example.com/api';

  useEffect(() => {
    // Check if wsEndpoint is a valid URL before attempting to create a WebSocket connection
    if (!wsEndpoint) {
      console.error('WebSocket endpoint URL is not defined.');
      return;
    }

    const websocket = new WebSocket(wsEndpoint);
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, new MessageDto(incomingMessage.id, incomingMessage.isUser, incomingMessage.content, incomingMessage.type)]);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
      setWs(null);
    };

    return () => {
      websocket.close();
    };
  }, [wsEndpoint]); // Reacting to changes in wsEndpoint

  const handleSendMessage = () => {
    if (input.trim() !== "" && ws) {
      const newMessage = new MessageDto(uuidv4(), true, input, 'text');
      setMessages(prevMessages => [...prevMessages, newMessage]);
      ws.send(JSON.stringify({ message: input }));
      setInput("");
    }
  };

  const sendAudioChunk = async (audioBlob: Blob) => {
    if (ws) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          ws.send(reader.result);
        } else {
          console.error('Failed to read audio chunk');
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading audio chunk:', error);
      };
      reader.readAsArrayBuffer(audioBlob);
    }
  };

  const onSendEmail = async () => {
    const emailContent = messages.map(msg => `${msg.isUser ? 'User' : 'sAIge'}: ${msg.content}`).join("\n");
  
    try {
      // Use apiEndpoint for making the fetch call
      if (!apiEndpoint) {
        console.error('API endpoint for sending email is not defined.');
        return;
      }

      const response = await fetch(`${apiEndpoint}/sendEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: emailContent }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      console.log("Email sent successfully.");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  return (
    <Container>
      <MessageList messages={messages} />
      <ChatInput
        input={input}
        isWaiting={!ws}
        onInputChange={(e) => setInput(e.target.value)}
        onSendMessage={handleSendMessage}
        sendAudioChunk={sendAudioChunk}
        onSendEmail={onSendEmail}
      />
    </Container>
  );
};

export default Chat;
