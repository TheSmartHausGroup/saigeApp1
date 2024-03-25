// src/components/SignIn.js
import React, { useState } from 'react';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";

const userPoolId = 'us-east-1_7ebtitahe'; // Your user pool id here
const clientId = '70pdm532cid6o6ntcsj91anc5n'; // Your client id here

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    const userPool = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
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
        // Redirect the user or show a success message
      },
      onFailure: (err) => {
        console.error('authentication failed', err);
        // Show an error message
      },
      mfaRequired: (codeDeliveryDetails) => {
        // Handle MFA scenario
        const verificationCode = prompt('Please input verification code', '');
        cognitoUser.sendMFACode(verificationCode, this);
      }
    });
  };

  return (
    <div>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default SignIn;
