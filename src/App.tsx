// Imports essential React functionalities and components for building the chat application.
import React, { useState, useCallback, useEffect } from 'react';
import Chat from './components/Chat'; // The component that displays chat messages.
import ChatInput from './components/ChatInput'; // The input component for sending new messages.
import SignIn from './components/SignIn'; // The component for signing in users.
import SignUp from './components/SignUp'; // The component for signing up new users.
import Navbar from './components/Navbar'; // The navigation bar component.
import { MessageDto } from './models/MessageDto'; // The data model for chat messages.
import { colorSchemes, defaultTheme, Theme, ThemeName } from './components/colorScheme'; // Theming utilities for UI customization.
import './index.css'; // Global styles for the application.

// The main component that encapsulates the entire chat application.
const App: React.FC = () => {
  // State hooks for managing application state.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Tracks user authentication status.
  const [user, setUser] = useState<{ username: string } | null>(null); // Stores authenticated user information.
  const [isWaiting, setIsWaiting] = useState<boolean>(false); // Indicates loading or waiting states.
  const [messages, setMessages] = useState<Array<MessageDto>>([ // Stores chat messages.
    new MessageDto('welcome-msg', false, 'What can we do together today?', 'text', new Date(), 'sent'), // Initial welcome message.
  ]);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn'); // Controls active tab in the authentication overlay.
  const [theme, setTheme] = useState<Theme>(defaultTheme); // Manages the current UI theme.
  const [ws, setWs] = useState<WebSocket | null>(null); // WebSocket connection for real-time communication.

  // Styles for interactive elements in the authentication overlay.
  const tabStyle = { cursor: 'pointer', padding: '10px', marginRight: '10px', color: '#43708f' }; // Default style for tabs.
  const activeTabStyle = { ...tabStyle, borderBottom: '2px solid #43708f', fontWeight: 'bold' }; // Style for the active tab.

  // Effect hook for initializing the WebSocket connection.
  useEffect(() => {
    const wsEndpoint = process.env.REACT_APP_WS_ENDPOINT; // Retrieves WebSocket endpoint from environment variables.
    if (wsEndpoint) {
      const webSocket = new WebSocket(wsEndpoint); // Creates a new WebSocket connection.
      webSocket.onopen = () => console.log('WebSocket Connected'); // Logs when the connection is successfully opened.
      webSocket.onmessage = (event) => console.log('Message from server:', event.data); // Handles incoming messages.
      webSocket.onerror = (error) => console.log('WebSocket Error', error); // Logs any connection errors.
      setWs(webSocket); // Updates the state with the WebSocket connection.
      return () => webSocket.close(); // Cleans up the connection on component unmount.
    }
  }, []);

  // Callback function for sending messages through WebSocket.
  const sendWebSocketMessage = useCallback((data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data)); // Sends data if the WebSocket is connected.
    } else {
      console.log('WebSocket is not connected.'); // Logs if the WebSocket connection is not open.
    }
  }, [ws]);

  // Handles user message sending, including both text and audio messages.
  const handleSendMessage = useCallback((message: string, audioBlob?: Blob) => {
    if (message.trim()) {
      // Creates and sends a text message.
      const newMessage = new MessageDto(Math.random().toString(36).substring(2, 15), true, message, 'text', new Date(), 'sent');
      setMessages(messages => [...messages, newMessage]);
      sendWebSocketMessage({ type: 'text', content: message });
    } else if (audioBlob) {
      // Processes and sends an audio message.
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob); // Converts audio blob to a data URL.
      reader.onloadend = () => sendWebSocketMessage({ type: 'audio', content: reader.result });
    }
  }, [sendWebSocketMessage]);

  // Sends an email with the chat history.
  const onSendEmail = useCallback(() => {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
    if (apiEndpoint && messages.length > 0 && user?.username) {
      const emailContent = messages.map(msg => `${msg.isUser ? 'User' : 'sAIge'}: ${msg.content}`).join('\n');
      fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.username, content: emailContent }),
      })
        .then(response => response.json())
        .then(data => console.log('Email sent successfully', data))
        .catch(error => console.error('Error sending email', error));
    }
  }, [messages, user?.username]);

  // Switches the application's theme.
  const switchTheme = useCallback((themeName: ThemeName) => {
    setTheme(colorSchemes[themeName]);
  }, []);

  // Renders the main application UI.
  return (
    <div className="chat-app-wrapper" style={{
      backgroundColor: theme.backgroundColor,
      backgroundImage: theme.isImage ? `url(${theme.backgroundImage})` : 'none',
    }}>
      {/* Navigation bar and authentication overlay */}
      {isAuthenticated && <Navbar user={user} onSignOut={() => setIsAuthenticated(false)} isAuthenticated={isAuthenticated} currentThemeName={theme.name as ThemeName} switchTheme={switchTheme} />}
      {isAuthenticated ? (
        <>
          {/* Chat interface */}
          <Chat messages={messages} theme={theme} />
          <ChatInput isWaiting={isWaiting} onSendMessage={handleSendMessage} onSendEmail={onSendEmail} theme={theme} onSendAudioChunk={function (audioChunk: Blob): void {
            throw new Error('Function not implemented.');
          } } />
        </>
      ) : (
        <div className="auth-overlay">
          {/* Authentication forms */}
          <div className="auth-tabs">
            <span style={activeTab === 'signIn' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('signIn')}>Sign In</span>
            &nbsp;|&nbsp;
            <span style={activeTab === 'signUp' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('signUp')}>Sign Up</span>
          </div>
          {activeTab === 'signIn' ? <SignIn onSignInSuccess={(username) => { setIsAuthenticated(true); setUser({username}); }} /> : <SignUp onSignUpSuccess={(username) => { setIsAuthenticated(true); setUser({username}); }} />}
        </div>
      )}
    </div>
  );
};

export default App; // Makes the App component available for use elsewhere.
