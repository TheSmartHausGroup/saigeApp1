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
  const [messages, setMessages] = useState<Array<MessageDto>>([]); // Ensure this matches your MessageDto type

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
    setMessages([]); // Clear messages on sign out
  }, []);

  const handleSendMessage = useCallback((message: string, audioBlob?: Blob) => {
    // Include logic for handling both text and audio messages here
    // Ensure messages are added to the 'messages' state accordingly
  }, []);

  const handleSendEmail = useCallback(() => {
    // Implement your email sending logic here
  }, []);

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
        <div className="auth-container">
          <SignIn onSignInSuccess={onSignInSuccess} />
          <SignUp onSignUpSuccess={onSignUpSuccess} />
        </div>
      )}
    </div>
  );
};

export default App;
