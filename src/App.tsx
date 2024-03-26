import React, { useState } from 'react';
import Chat from './components/Chat';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar'; // Make sure to import the Navbar component
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
          <Navbar username={user.username} onSignOut={signOut} />
          <Chat />
        </>
      ) : (
        <div className="authOverlay">
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
