// App.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';
import { CognitoUser } from 'amazon-cognito-identity-js';

// Extending the CognitoUser type for TypeScript compatibility
interface MockCognitoUser extends CognitoUser {
  authenticateUser: jest.Mock;
}

jest.mock('amazon-cognito-identity-js', () => {
  return {
    CognitoUserPool: jest.fn(() => ({
      // Mock implementation can be empty for this test
    })),
    AuthenticationDetails: jest.fn(),
    CognitoUser: jest.fn(() => ({
      authenticateUser: jest.fn((authDetails, callbacks) => {
        callbacks.onSuccess(); // Simulating a successful authentication
      }),
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
    await waitFor(() => expect(screen.getByText(/welcome/i)).toBeInTheDocument());
  });
});
