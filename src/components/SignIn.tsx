import React, { useState } from 'react';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

interface SignInProps {
  onSignInSuccess: (username: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignInSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Set these values according to your Cognito User Pool
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID || '', // Provide a fallback value or handle missing environment variable
      ClientId: process.env.REACT_APP_CLIENT_ID || '', // Provide a fallback value or handle missing environment variable
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
        onSignInSuccess(username); // Notify the parent component
      },
      onFailure: (err) => {
        console.error('Authentication failed', err);
        // Optionally, inform the user of the failure
      },
      // Consider handling additional cases like MFA, newPasswordRequired, etc.
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
    </form>
  );
};

export default SignIn;
