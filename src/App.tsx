import React, { useState, useCallback } from 'react';
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
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>([
    new MessageDto('welcome-msg', false, 'What can we do together today?', 'text', new Date(), 'sent'),
  ]);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn');
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const onSignInSuccess = useCallback((username: string) => {
    setIsAuthenticated(true);
    setUser({ username });
  }, []);

  const onSignUpSuccess = useCallback((username: string) => {
    setIsAuthenticated(true);
    setUser({ username });
  }, []);

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setMessages([new MessageDto('welcome-msg', false, 'What can we do together today?', 'text', new Date(), 'sent')]);
  }, []);

  const handleSendMessage = useCallback((message: string, audioBlob?: Blob) => {
    const newMessage = new MessageDto(Math.random().toString(36).substring(2, 15), true, message, 'text', new Date(), 'sent');
    setMessages(messages => [...messages, newMessage]);
  }, [messages]);

  const handleSendEmail = useCallback(async () => {
    // Email sending logic
  }, [messages]);

  const switchTheme = useCallback((themeName: ThemeName) => {
    const newTheme = colorSchemes[themeName as ThemeName];
    setTheme(newTheme);
  }, []);

  const tabStyle = {
    color: '#43708f', // Tab text color
    cursor: 'pointer',
  };

  const activeTabStyle = {
    borderBottom: '2px solid #43708f', // Active tab underline color
    color: '#43708f',
  };

  return (
    <div className="chat-app-wrapper" style={{
      background: theme.isImage ? `url(${theme.backgroundColor})` : theme.backgroundColor,
      color: theme.textColor,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    }}>
      <Navbar user={user} onSignOut={signOut} isAuthenticated={isAuthenticated} currentThemeName={theme.name as ThemeName} switchTheme={switchTheme} />
      {isAuthenticated && user ? (
        <>
          <Chat messages={messages} theme={theme} />
          <ChatInput isWaiting={isWaiting} onSendMessage={handleSendMessage} onSendEmail={handleSendEmail} theme={theme} />
        </>
      ) : (
        <div className="auth-overlay">
          <div className="auth-tabs">
            <span style={activeTab === 'signIn' ? {...tabStyle, ...activeTabStyle} : tabStyle} onClick={() => setActiveTab('signIn')}>Sign In</span>
            &nbsp;|&nbsp;
            <span style={activeTab === 'signUp' ? {...tabStyle, ...activeTabStyle} : tabStyle} onClick={() => setActiveTab('signUp')}>Sign Up</span>
          </div>
          {activeTab === 'signIn' ? <SignIn onSignInSuccess={onSignInSuccess} /> : <SignUp onSignUpSuccess={onSignUpSuccess} />}
          {activeTab === 'signIn' ? (
            <button onClick={() => onSignInSuccess('testUser')}>Sign In</button>
          ) : (
            <button onClick={() => onSignUpSuccess('testUser')}>Sign Up</button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;