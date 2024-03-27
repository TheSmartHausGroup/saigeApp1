import React, { useState, FormEvent, ChangeEvent } from 'react';
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { countryCodes } from './countryCodes'; // Ensure this import points to your country codes file

interface SignUpProps {
  onSignUpSuccess: (username: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const formattedPhoneNumber = `${selectedCountryCode}${phoneNumber.replace(/\D/g, '')}`;

    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID!,
      ClientId: process.env.REACT_APP_CLIENT_ID!,
    });

    const attributeList = [
      new CognitoUserAttribute({ Name: 'name', Value: firstName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'phone_number', Value: formattedPhoneNumber }),
      new CognitoUserAttribute({ Name: 'birthdate', Value: dateOfBirth }),
    ];

    userPool.signUp(username, password, attributeList as CognitoUserAttribute[], [], (err, result) => {
      setIsLoading(false); // Ensure loading state is reset whether the call succeeds or fails
      if (err) {
        console.error(err.message || 'An unknown error occurred');
        return;
      }
      if (result) {
        onSignUpSuccess(username);
        console.log('User name is ' + result.user.getUsername());
      }
    });
  };

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountryCode(event.target.value);
  };

  return (
    <div className="signup-overlay">
      <form onSubmit={handleSubmit}>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <select value={selectedCountryCode} onChange={handleCountryChange} defaultValue="">
          <option value="" disabled>Select Country Code</option>
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>{country.name} {country.flag}</option>
          ))}
        </select>
        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number (XXX) XXX-XXXX" required />
        <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} placeholder="Date of Birth" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
      </form>
    </div>
  );
};

export default SignUp;

