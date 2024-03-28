import React, { useState } from 'react'; // Import React library for building components and useState hook for state management.
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js'; // Import components from the Amazon Cognito Identity SDK for JavaScript.

// Define interface for SignUp component props.
interface SignUpProps {
  // onSignUpSuccess function prop to be called with the username upon successful sign-up.
  onSignUpSuccess: (username: string) => void;
}

// SignUp component definition.
const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  // State for storing user input: username, email, password.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State for storing any sign-up error messages.
  const [error, setError] = useState('');

  // Handler for form submission.
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission action.

    // Create a new CognitoUserPool instance with our User Pool ID and Client ID from environment variables.
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID || '',
      ClientId: process.env.REACT_APP_CLIENT_ID || '',
    });

    // User attributes to include in the sign-up request.
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];

    // Attempt to sign up the user with Cognito.
    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        // If there's an error during sign-up, set the error message in state.
        setError(err.message || JSON.stringify(err));
        return;
      }
      // On successful sign-up, call the onSignUpSuccess prop function.
      onSignUpSuccess(username);
    });
  };

  // Render the sign-up form.
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state as user types.
          placeholder="Username"
          required // Username field is required.
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state as user types.
          placeholder="Email"
          required // Email field is required.
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state as user types.
          placeholder="Password"
          required // Password field is required.
        />
        <button type="submit">Sign Up</button> 
        {error && <p style={{ color: 'red' }}>{error}</p>} 
      </form>
    </div>
  );
};

export default SignUp; // Export SignUp component for use in other parts of the app.
