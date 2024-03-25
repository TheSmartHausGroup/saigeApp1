import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Define minimal types for the parts you are mocking
interface AuthDetails {
  username: string;
  password: string;
}

interface Callbacks {
  onSuccess: (session?: any) => void;
  onFailure: (error: { message: string }) => void;
}

jest.mock('amazon-cognito-identity-js', () => ({
  CognitoUserPool: jest.fn().mockImplementation(() => ({})),
  AuthenticationDetails: jest.fn(),
  CognitoUser: jest.fn().mockImplementation(() => ({
    authenticateUser: (authDetails: AuthDetails, callbacks: Callbacks) => {
      if (authDetails.username === 'correctUser' && authDetails.password === 'correctPass') {
        callbacks.onSuccess();
      } else {
        callbacks.onFailure({ message: 'Incorrect username or password.' });
      }
    }
  }))
}));

test('successful sign-in updates the UI', async () => {
  const { getByPlaceholderText, getByText } = render(<App />);

  fireEvent.change(getByPlaceholderText(/username/i), { target: { value: 'correctUser' } });
  fireEvent.change(getByPlaceholderText(/password/i), { target: { value: 'correctPass' } });
  fireEvent.click(getByText(/sign in/i));

  await waitFor(() => expect(getByText(/welcome/i)).toBeInTheDocument());
});
