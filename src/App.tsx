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
    new MessageDto(
      'welcome-msg', // Assuming a static ID for the welcome message
      false, // Assuming this message is not from the user
      'What can we do together today?',
      'text', // Assuming 'text' type for simple messages
      new Date(), // Optional: current timestamp
      'sent' // Optional: status of the message
    )
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
    const newMessage = new MessageDto(
      Math.random().toString(36).substring(2, 15),
      true,
      message,
      'text',
      new Date(),
      'sent'
    );
    setMessages(messages => [...messages, newMessage]);
  }, [messages]);

  const handleSendEmail = useCallback(async () => {
    const emailData = {
      messages: messages.map(msg => ({ content: msg.content, sender: msg.isUser ? 'User' : 'Saige' })),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }, [messages]);

  return (
    <div className="App">
      <Navbar user={user} onSignOut={signOut} isAuthenticated={isAuthenticated} />
      {isAuthenticated && user ? (
        <>
          <Chat messages={messages} />
          <ChatInput
            isWaiting={isWaiting}
            onSendMessage={handleSendMessage}
            onSendEmail={handleSendEmail}
          />
        </>
      ) : (
        <div className="auth-overlay">
          <div className="tabs">
            <button onClick={() => setActiveTab('signIn')} disabled={activeTab === 'signIn'}>Sign In</button>
            <button onClick={() => setActiveTab('signUp')} disabled={activeTab === 'signUp'}>Sign Up</button>
          </div>
          <div className="auth-container">
            {activeTab === 'signIn' ? <SignIn onSignInSuccess={onSignInSuccess} /> : <SignUp onSignUpSuccess={onSignUpSuccess} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
