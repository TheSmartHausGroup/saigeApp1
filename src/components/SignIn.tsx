import React, { useState } from 'react';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

interface SignInProps {
  onSignInSuccess: (username: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignInSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Added for error feedback

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID || '',
      ClientId: process.env.REACT_APP_CLIENT_ID || '',
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
        console.log('Authentication success', result);
        onSignInSuccess(username);
      },
      onFailure: (err) => {
        console.error('Authentication failed', err);
        setError(err.message || 'An error occurred.'); // Set error feedback
      },
    });
  };

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error feedback */}
    </form>
  );
};

export default SignIn;
