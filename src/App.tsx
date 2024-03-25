import React, { useState } from 'react';
import Chat from './components/Chat';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp'; // Ensure you have this component created
import './index.css'; // Ensure your CSS is set up for styling

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn'); // New state to control active tab
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
    setActiveTab('signIn'); // Reset to sign-in tab on sign out
  };

  return (
    <div className="App">
      {isAuthenticated && user ? (
        <>
          <h1>Welcome, {user.username}!</h1>
          <button onClick={signOut}>Sign out</button>
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
