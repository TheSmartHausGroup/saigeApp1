import React, { useState, FormEvent } from 'react';
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';

interface SignUpProps {
  onSignUpSuccess: (username: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  // State hooks for each form input
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // User pool configuration from .env
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID!,
      ClientId: process.env.REACT_APP_CLIENT_ID!,
    });

    // Attributes for the new user
    const attributeList = [
      new CognitoUserAttribute({ Name: 'name', Value: firstName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber }), // Ensure the phone number is in the correct format
      new CognitoUserAttribute({ Name: 'birthdate', Value: dateOfBirth }),
    ];

    // Signing up the user
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err || !result) {
        alert(err?.message || JSON.stringify(err));
        return;
      }
      onSignUpSuccess(username); // Invoke the success callback
      console.log('User name is ' + result.user.getUsername());
    });
  };

  return (
    <div className="signup-overlay">
      <form onSubmit={handleSubmit}>
        {/* Input fields for user information */}
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        {/* Updated phone number input with placeholder for format example */}
        <input 
          type="tel" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          placeholder="+1 (555) 555-1234" // Example for US number format
          required 
        />
        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} placeholder="Date of Birth" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
