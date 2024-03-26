import React, { useState, FormEvent, ChangeEvent } from 'react';
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { countryCodes } from './countryCodes'; // Ensure this import points to your country codes file

interface SignUpProps {
  onSignUpSuccess: (username: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(countryCodes[0].code);
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
        <label>First Name<input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></label>
        <label>Last Name<input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required /></label>
        <label>Username<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Country Code
          <select value={selectedCountryCode} onChange={handleCountryChange} aria-label="Country Code">
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>{country.name} {country.flag}</option>
            ))}
          </select>
        </label>
        <label>Phone Number<input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number (no country code)" required /></label>
        <label>Date of Birth<input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <button type="submit" disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
      </form>
    </div>
  );
};

export default SignUp;
