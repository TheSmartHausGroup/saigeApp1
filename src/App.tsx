import React, { useState } from 'react';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import Chat from './components/Chat';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cognitoUser, setCognitoUser] = useState(null);
  
  // New state variables for form input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (event) => {
    event.preventDefault(); // Prevent form from causing page reload

    const userPool = new CognitoUserPool({
      UserPoolId: 'us-east-1_7ebtitahe', // Replace with your user pool id
      ClientId: '70pdm532cid6o6ntcsj91anc5n', // Replace with your client id
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('authentication success', result);
        setIsAuthenticated(true);
        setUser({ username: username });
        setCognitoUser(cognitoUser);
      },
      onFailure: (err) => {
        console.error('authentication failed', err);
      },
      mfaRequired: (codeDeliveryDetails) => {
        const verificationCode = prompt('Please input verification code', '');
        cognitoUser.sendMFACode(verificationCode, this);
      },
    });
  };

  const signOut = () => {
    if (cognitoUser) {
      cognitoUser.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setCognitoUser(null);
      console.log("User signed out.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {isAuthenticated && user ? (
          <>
            <h1 style={{ textAlign: 'center' }}>Hi, I'm sAIge, welcome {user.username}</h1>
            <button onClick={signOut} style={{ position: 'absolute', right: 20, top: 20 }}>Sign out</button>
          </>
        ) : (
          // Sign-in form
          <form onSubmit={signIn}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign In</button>
          </form>
        )}
      </header>
      <main>
        {isAuthenticated ? <Chat /> : <div>Please sign in above</div>}
      </main>
    </div>
  );
};

export default App;
