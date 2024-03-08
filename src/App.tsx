// src/App.tsx
import React from 'react';
// import Amplify from 'aws-amplify';
// import awsExports from './aws-exports'; // Make sure the path is correct
import Chat from './components/Chat';

// Amplify.configure(awsExports);

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ textAlign: 'center' }}>Hi, I'm sAIge</h1>
      </header>
      <main>
        <Chat />
      </main>
    </div>
  );
};

export default App;
