import React, { useState, FormEvent, ChangeEvent } from 'react'; // Imports necessary hooks and types from React.
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js'; // Imports from amazon-cognito-identity-js for handling user registration.
import { countryCodes } from './countryCodes'; // Imports an array of country codes and details, ensure this points to your file with country code data.

// Interface to type the props expected by the SignUp component.
interface SignUpProps {
  onSignUpSuccess: (username: string) => void; // Callback function to be called upon successful signup.
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess }) => {
  // State hooks for form fields and loading indicator.
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(''); // State for the selected country code.
  const [firstName, setFirstName] = useState<string>(''); // State for the first name.
  const [lastName, setLastName] = useState<string>(''); // State for the last name.
  const [username, setUsername] = useState<string>(''); // State for the username.
  const [email, setEmail] = useState<string>(''); // State for the email.
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // State for the phone number.
  const [dateOfBirth, setDateOfBirth] = useState<string>(''); // State for the date of birth.
  const [password, setPassword] = useState<string>(''); // State for the password.
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for managing the loading state of the form submission.

  // Function to handle form submission.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevents the default form submission action.
    setIsLoading(true); // Sets loading state to true.

    // Formats phone number by appending selected country code and removing non-digit characters.
    const formattedPhoneNumber = `${selectedCountryCode}${phoneNumber.replace(/\D/g, '')}`;

    // Creates a new user pool instance with IDs from environment variables.
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID!,
      ClientId: process.env.REACT_APP_CLIENT_ID!,
    });

    // Prepares a list of user attributes to be submitted with the signup request.
    const attributeList = [
      new CognitoUserAttribute({ Name: 'name', Value: firstName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'phone_number', Value: formattedPhoneNumber }),
      new CognitoUserAttribute({ Name: 'birthdate', Value: dateOfBirth }),
    ];

    // Attempts to sign up the user with the provided attributes.
    userPool.signUp(username, password, attributeList as CognitoUserAttribute[], [], (err, result) => {
      setIsLoading(false); // Resets loading state on completion.
      if (err) {
        console.error(err.message || 'An unknown error occurred'); // Logs any errors.
        return;
      }
      if (result) {
        onSignUpSuccess(username); // Calls the success callback with the username.
        console.log('User name is ' + result.user.getUsername()); // Logs the Cognito username.
      }
    });
  };

  // Function to handle changes in the country code selection.
  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountryCode(event.target.value); // Updates the selected country code state.
  };

  // Renders the signup form.
  return (
    <div className="signup-overlay">
      <form onSubmit={handleSubmit}>
        {/* Input fields for user details and account information. */}
        {/* Each input field updates its corresponding state on change. */}
        {/* The form submission button displays 'Signing Up...' when isLoading is true. */}
      </form>
    </div>
  );
};

export default SignUp; // Exports the SignUp component.
