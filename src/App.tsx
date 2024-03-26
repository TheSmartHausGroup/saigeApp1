import React, { useState } from 'react';
import Chat from './components/Chat';
import ChatInput from './components/ChatInput'; // Assuming you have this component
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
      {isAuthenticated && user ? (
        <>
          <Navbar user={user} onSignOut={signOut} />
          <div className="content">
            <div className="message-container">
              <h1>Welcome, {user.username}!</h1>
            </div>
            <div className="chat-container">
              <Chat />
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
              } } />
            </div>
          </div>
        </>
      ) : (
        <div className="auth-overlay">
          <div className="tabs">
            <button onClick={() => setActiveTab('signIn')} className={activeTab === 'signIn' ? 'active' : ''}>Sign In</button>
            <button onClick={() => setActiveTab('signUp')} className={activeTab === 'signUp' ? 'active' : ''}>Sign Up</button>
          </div>
          <div className="tab-content">
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
