import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import SignIn from './components/SignIn';
import './index.css'; // Assuming you have an App.css for your styling

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  const onSignInSuccess = (username: string) => {
    setIsAuthenticated(true);
    setUser({ username });
  };

  useEffect(() => {
    // Optional: Check local storage or session for existing authentication details
    // and set isAuthenticated accordingly to keep the user signed in across sessions.
  }, []);

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Optional: Clear any stored authentication details from local storage or session.
  };

  return (
    <div className="App">
      <main>
        {isAuthenticated && user ? (
          <>
            <header>
              <h1>Hi, {user.username}</h1>
              <button onClick={signOut}>Sign out</button>
            </header>
            <Chat />
          </>
        ) : (
          <div className="signInOverlay">
            <SignIn onSignInSuccess={onSignInSuccess} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
