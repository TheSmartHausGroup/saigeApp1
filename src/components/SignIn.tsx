import React, { useState } from 'react'; // Imports React and useState hook for component state management.
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'; // Imports necessary constructs from the amazon-cognito-identity-js library for authentication.

// Defines the props expected by the SignIn component, including a callback function for successful sign-in.
interface SignInProps {
  onSignInSuccess: (username: string) => void; // Callback when sign-in is successful.
}

const SignIn: React.FC<SignInProps> = ({ onSignInSuccess }) => {
  const [username, setUsername] = useState(''); // State for storing the username input by the user.
  const [password, setPassword] = useState(''); // State for storing the password input by the user.
  const [error, setError] = useState(''); // State for storing any error messages to display to the user.

  // Handler function for the sign-in process.
  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the default form submission behavior to handle sign-in programmatically.
    setError(''); // Clears any previous error messages.

    // Constructs a new CognitoUserPool object with the User Pool ID and Client ID from environment variables.
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID || '', // Fetches the User Pool ID from environment variables, defaults to empty string if not found.
      ClientId: process.env.REACT_APP_CLIENT_ID || '', // Fetches the Client ID from environment variables, defaults to empty string if not found.
    });

    // Creates an AuthenticationDetails object with the username and password provided by the user.
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    // Defines the user data needed to create a CognitoUser object.
    const userData = {
      Username: username,
      Pool: userPool,
    };

    // Creates a CognitoUser object with the user data.
    const cognitoUser = new CognitoUser(userData);

    // Attempts to authenticate the user with Cognito.
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => { // Callback for successful authentication.
        console.log('Authentication success', result); // Logs success for debugging.
        onSignInSuccess(username); // Calls the onSignInSuccess prop callback with the username.
      },
      onFailure: (err) => { // Callback for failed authentication.
        console.error('Authentication failed', err); // Logs the error for debugging.
        setError(err.message || 'An error occurred.'); // Updates the error state with the error message.
      },
    });
  };

  // Renders the sign-in form.
  return (
    <form onSubmit={handleSignIn}> {/* Form submission handler. */}
      <input
        type="text"
        value={username} // Binds the input value to the username state.
        onChange={(e) => setUsername(e.target.value)} // Updates the username state as the user types.
        placeholder="Username"
        required // Makes the field required for form submission.
      />
      <input
        type="password"
        value={password} // Binds the input value to the password state.
        onChange={(e) => setPassword(e.target.value)} // Updates the password state as the user types.
        placeholder="Password"
        required // Makes the field required for form submission.
      />
      <button type="submit">Sign In</button> {/* Submits the form. */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Displays any error messages in red. */}
    </form>
  );
};

export default SignIn; // Exports the SignIn component for use elsewhere in the application.
