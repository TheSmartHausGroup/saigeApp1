import React, { useState, FormEvent } from 'react';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import Chat from './components/Chat';

// Define the structure of the user information you plan to keep in state
interface UserInfo {
  username: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);

  // New state variables for form input
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userPool = new CognitoUserPool({
      UserPoolId: 'us-east-1_7ebtitahe',
      ClientId: '70pdm532cid6o6ntcsj91anc5n',
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const newUser = new CognitoUser(userData);

    newUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('authentication success', result);
        setIsAuthenticated(true);
        setUser({ username });
        setCognitoUser(newUser);
      },
      onFailure: (err) => {
        console.error('authentication failed', err);
      },
      mfaRequired: (codeDeliveryDetails) => {
        const verificationCode = prompt('Please input verification code', '');
        if (verificationCode) {
          // Correct usage of sendMFACode with the necessary callback object
          newUser.sendMFACode(verificationCode, {
            onSuccess: (session) => {
              console.log('MFA verification success', session);
              // Consider updating the application state as necessary here
            },
            onFailure: (err) => {
              console.error('MFA verification failed', err);
              // Handle MFA verification failure as necessary
            }
          });
        }
      },
    });
  }
    function signOut() {
    if (cognitoUser) {
      cognitoUser.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setCognitoUser(null);
      console.log("User signed out.");
    }
  }

    return (
      <div className="App">
        <header className="App-header">
          {isAuthenticated && user ? (
            <>
              <h1 style={{ textAlign: 'center' }}>Hi, I'm sAIge, welcome {user.username}</h1>
              <button onClick={signOut} style={{ position: 'absolute', right: 20, top: 20 }}>Sign out</button>
            </>
          ) : (
            <form onSubmit={signIn}>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
