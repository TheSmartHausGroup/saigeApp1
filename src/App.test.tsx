// App.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';
import { AuthenticationDetails } from 'amazon-cognito-identity-js';

// Extending the mock to include signIn method for better type compatibility
jest.mock('amazon-cognito-identity-js', () => {
  const actualModule = jest.requireActual('amazon-cognito-identity-js');
  return {
    ...actualModule,
    CognitoUserPool: jest.fn(() => ({
      // Mock implementation can be empty for this test
    })),
    AuthenticationDetails: jest.fn(),
    CognitoUser: function() {
      return {
        authenticateUser: jest.fn((authDetails, callbacks) => {
          callbacks.onSuccess();
        }),
        signOut: jest.fn(),
        // Mock additional methods as necessary
      };
    },
  };
});

describe('App component', () => {
  test('successful sign-in updates the UI', async () => {
    render(<App />);

    // Enter credentials
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });
    
    // Click the sign-in button
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Adjust the expected text based on your App's implementation
    // For instance, if your success sign-in message or UI includes the username, ensure it matches.
    await waitFor(() => expect(screen.getByText(/Hi, I'm sAIge, welcome testuser/)).toBeInTheDocument());
  });
});
