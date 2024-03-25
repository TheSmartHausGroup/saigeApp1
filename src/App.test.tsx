// App.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';

jest.mock('amazon-cognito-identity-js', () => {
  const originalModule = jest.requireActual('amazon-cognito-identity-js');

  return {
    ...originalModule,
    CognitoUserPool: jest.fn(() => ({
      // Your mock implementation can mimic real behavior or be empty for this test
    })),
    AuthenticationDetails: jest.fn(),
    CognitoUser: jest.fn(() => ({
      authenticateUser: jest.fn((authDetails, callbacks) => {
        // Assuming a successful authentication scenario for this test
        callbacks.onSuccess({
          getIdToken: jest.fn(() => ({
            getJwtToken: jest.fn(() => "testToken")
          }))
        }); 
      }),
      signOut: jest.fn(),
      // Add any other methods you call on the CognitoUser instance
    })),
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

    // Check if the welcome message appears
    await waitFor(() => expect(screen.getByText(/Hi, I'm sAIge, welcome testuser/)).toBeInTheDocument());
  });
});
