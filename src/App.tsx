import React, { useState, useCallback } from 'react';
import Chat from './components/Chat';
import ChatInput from './components/ChatInput';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import { MessageDto } from './models/MessageDto';
import './index.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>([
    new MessageDto('welcome-msg', false, 'What can we do together today?', 'text', new Date(), 'sent')
  ]);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn');

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

  return (
    <div className="chat-app-wrapper">
      <Navbar user={user} onSignOut={signOut} isAuthenticated={isAuthenticated} />
      {isAuthenticated && user ? (
        <>
          <div className="chat-container">
            <Chat messages={messages} />
          </div>
          <ChatInput
            isWaiting={isWaiting}
            onSendMessage={handleSendMessage}
            onSendEmail={handleSendEmail}
          />
        </>
      ) : (
        <div className="auth-overlay">
          {activeTab === 'signIn' ? <SignIn onSignInSuccess={onSignInSuccess} /> : <SignUp onSignUpSuccess={onSignUpSuccess} />}
        </div>
      )}
    </div>
  );
};

export default App;
