import React, { useState } from 'react';
import Chat from './components/Chat';
import ChatInput from './components/ChatInput';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import './index.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  // Handlers for sign-in and sign-up success
  const onSignInSuccess = (username: string) => {
    setIsAuthenticated(true);
    setUser({ username });
  };

  const onSignUpSuccess = (username: string) => {
    setIsAuthenticated(true);
    setUser({ username });
  };

  // Handler for signing out
  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} user={user} onSignOut={signOut} />
      {isAuthenticated ? (
        <main className="chat-area">
          <Chat />
          <ChatInput input={''} isWaiting={false} onInputChange={function (event: React.ChangeEvent<HTMLInputElement>): void {
            throw new Error('Function not implemented.');
          } } onSendMessage={function (): void {
            throw new Error('Function not implemented.');
          } } sendAudioChunk={function (audioBlob: Blob): void {
            throw new Error('Function not implemented.');
          } } onSendEmail={function (): void {
            throw new Error('Function not implemented.');
          } } />
        </main>
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
