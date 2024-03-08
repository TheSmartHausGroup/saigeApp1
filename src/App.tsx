// src/App.tsx
import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator, WithAuthenticatorProps } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Chat from './components/Chat';

Amplify.configure(config);

// Update the App component to accept WithAuthenticatorProps
const App: React.FC<WithAuthenticatorProps> = ({ signOut, user }) => {
  return (
    <div className="App">
      <header className="App-header">
        {/* Personalized greeting using the authenticated user's username */}
        <h1 style={{ textAlign: 'center' }}>Hi, I'm sAIge, welcome {user?.username}</h1>
        {/* Sign out button */}
        <button onClick={signOut} style={{ position: 'absolute', right: 20, top: 20 }}>Sign out</button>
      </header>
      <main>
        <Chat />
      </main>
    </div>
  );
};

// Wrap App component with withAuthenticator to enforce authentication
export default withAuthenticator(App);
