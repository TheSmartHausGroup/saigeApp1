import React, { useState } from 'react';
import Chat from './components/Chat';
import ChatInput from './components/ChatInput'; // Assuming you have this component for input
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar'; // Assuming you have this component for navigation
import './index.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn');
  const [user, setUser] = useState<{ username: string } | null>(null);

  const onSignInSuccess = (username: string) => {
    setIsAuthenticated(true);
    setUser({ username });
  };

  const onSignUpSuccess = (username: string) => {
    setIsAuthenticated(true);
    setUser({ username });
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('signIn');
  };

  return (
    <div className="App">
      <Navbar user={user} onSignOut={signOut} /> {/* Navigation at the top */}
      {isAuthenticated && user ? (
        <>
          <div className="message-container">
            {/* Centered message/welcome area. Could also be a dedicated component */}
            <h1>Welcome, {user.username}!</h1>
          </div>
          <div className="chat-container">
            <Chat /> {/* Chat message history */}
          </div>
          <div className="input-container">
            <ChatInput input={''} isWaiting={false} onInputChange={function (event: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error('Function not implemented.');
            } } onSendMessage={function (): void {
              throw new Error('Function not implemented.');
            } } sendAudioChunk={function (audioBlob: Blob): void {
              throw new Error('Function not implemented.');
            } } onSendEmail={function (): void {
              throw new Error('Function not implemented.');
            } } /> {/* User input for new messages */}
          </div>
        </>
      ) : (
        <div className="auth-overlay">
          <div className="tabs">
            <button onClick={() => setActiveTab('signIn')} className={activeTab === 'signIn' ? 'active' : ''}>Sign In</button>
            <button onClick={() => setActiveTab('signUp')} className={activeTab === 'signUp' ? 'active' : ''}>Sign Up</button>
          </div>
          <div className="tabContent">
            {activeTab === 'signIn' ? (
              <SignIn onSignInSuccess={onSignInSuccess} />
            ) : (
              <SignUp onSignUpSuccess={onSignUpSuccess} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
