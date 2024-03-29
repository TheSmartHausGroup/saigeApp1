import React, { useState, useCallback, useEffect } from 'react';
import Chat from './components/Chat';
import ChatInput from './components/ChatInput';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import { MessageDto } from './models/MessageDto';
import { colorSchemes, defaultTheme, Theme, ThemeName } from './components/colorScheme';
import './index.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [messages, setMessages] = useState<Array<MessageDto>>([
    new MessageDto('welcome-msg', false, 'What can we do together today?', 'text', new Date(), 'sent'),
  ]);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn');
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    const wsEndpoint = process.env.REACT_APP_WS_ENDPOINT;
    if (!wsEndpoint) return;

    const webSocket = new WebSocket(wsEndpoint);

    webSocket.onopen = () => console.log('WebSocket Connected');
    webSocket.onmessage = (event) => console.log('Message from server:', event.data);
    webSocket.onerror = (error) => console.log('WebSocket Error', error);
    webSocket.onclose = () => {
      console.log('WebSocket Disconnected. Attempting to reconnect...');
      setTimeout(connectWebSocket, 3000); // Attempt to reconnect every 3 seconds
    };

    setWs(webSocket);
    return () => webSocket.close();
  }, []);

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  const sendWebSocketMessage = useCallback((data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      console.log('WebSocket is not connected.');
    }
  }, [ws]);

  const handleSendMessage = useCallback((message: string, audioBlob?: Blob) => {
    if (message.trim()) {
      const newMessage = new MessageDto(Math.random().toString(36).substring(2, 15), true, message, 'text', new Date(), 'sent');
      setMessages(messages => [...messages, newMessage]);
      sendWebSocketMessage({ type: 'text', content: message });
    } else if (audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => sendWebSocketMessage({ type: 'audio', content: reader.result });
    }
  }, [sendWebSocketMessage]);

  const onSendEmail = useCallback(() => {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
    if (!apiEndpoint || messages.length === 0 || !user?.username) {
      console.log('Missing API endpoint or insufficient data to send email.');
      return;
    }

    const emailContent = messages.map(msg => `${msg.isUser ? 'User' : 'sAIge'}: ${msg.content}`).join('\n');
    fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.username, content: emailContent }),
    })
      .then(response => response.json())
      .then(data => console.log('Email sent successfully', data))
      .catch(error => {
        console.error('Error sending email', error);
        // Implement user-friendly error handling/display here
      });
  }, [messages, user?.username]);

  const switchTheme = useCallback((themeName: ThemeName) => {
    setTheme(colorSchemes[themeName]);
  }, []);

  // Define styles for tabs.
  const tabStyle = { cursor: 'pointer', padding: '10px', marginRight: '10px', color: '#43708f' };
  const activeTabStyle = { ...tabStyle, borderBottom: '2px solid #43708f', fontWeight: 'bold' };

  return (
    <div className="chat-app-wrapper" style={{
      backgroundColor: theme.backgroundColor,
      backgroundImage: theme.isImage ? `url(${theme.backgroundImage})` : 'none',
    }}>
      {isAuthenticated && <Navbar user={user} onSignOut={() => { setIsAuthenticated(false); setWs(null); }} isAuthenticated={isAuthenticated} currentThemeName={theme.name as ThemeName} switchTheme={switchTheme} />}
      {isAuthenticated ? (
        <>
          <Chat messages={messages} theme={theme} />
          <ChatInput isWaiting={false} onSendMessage={handleSendMessage} onSendEmail={onSendEmail} theme={theme} onSendAudioChunk={() => { /* Placeholder function */ }} />
        </>
      ) : (
        <div className="auth-overlay">
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

export default App;
