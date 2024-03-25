import React, { useState, FormEvent } from 'react';
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';

interface SignUpProps {
  onSignUpSuccess: (username: string) => void; // Correct typing for props
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (event: FormEvent) => { // Correctly type the event
    event.preventDefault();

    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID!, // Use non-null assertion or provide a fallback
      ClientId: process.env.REACT_APP_CLIENT_ID!, // Use non-null assertion or provide a fallback
    });

    const attributeList = [
      new CognitoUserAttribute({ Name: 'name', Value: firstName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber }), 
      new CognitoUserAttribute({ Name: 'birthdate', Value: dateOfBirth }), 
    ];

    userPool.signUp(username, password, attributeList, [], (err, result) => { // Replace null with []
      if (err || !result) { // Check for result being undefined
        alert(err?.message || JSON.stringify(err));
        return;
      }
      onSignUpSuccess(username);
      console.log('User name is ' + result.user.getUsername());
    });
  };

  return (
    <div className="signup-overlay">
      <form onSubmit={handleSubmit}>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} placeholder="Date of Birth" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
