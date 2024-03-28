import React, { useState, useCallback, useEffect } from 'react'; // Imports useState, useCallback, and useEffect hooks from React for state management and lifecycle events.
import Chat from './components/Chat'; // Imports the Chat component from the components folder.
import ChatInput from './components/ChatInput'; // Imports the ChatInput component for inputting messages.
import SignIn from './components/SignIn'; // Imports the SignIn component for the sign-in form.
import SignUp from './components/SignUp'; // Imports the SignUp component for the sign-up form.
import Navbar from './components/Navbar'; // Imports the Navbar component for navigation.
import { MessageDto } from './models/MessageDto'; // Imports the MessageDto model for message data structure.
import { colorSchemes, defaultTheme, Theme, ThemeName } from './components/colorScheme'; // Imports theme-related constants and types for theme management.
import './index.css'; // Imports global CSS styles.

const App: React.FC = () => { // Defines the App component as a functional component.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // State to track if a user is authenticated.
  const [user] = useState<{ username: string } | null>(null); // State to store user information, initialized to null.
  const [isWaiting] = useState<boolean>(false); // State to indicate if the app is waiting for something (e.g., a response).
  const [messages, setMessages] = useState<Array<MessageDto>>([ // State to store messages, initialized with a welcome message.
    new MessageDto('welcome-msg', false, 'What can we do together today?', 'text', new Date(), 'sent'),
  ]);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn'); // State to manage which tab is active in the authentication form.
  const [theme, setTheme] = useState<Theme>(defaultTheme); // State to manage the theme, initialized to the default theme.
  const [ws, setWs] = useState<WebSocket | null>(null); // State for the WebSocket connection, initialized to null.

  // Inline styles for the tabs in the authentication overlay.
  const tabStyle = {
    cursor: 'pointer', // Makes the tab clickable.
    padding: '10px', // Adds padding around the tab text for better appearance.
    marginRight: '10px', // Adds spacing to the right of the tab for separation.
    color: '#43708f', // Text color for the tab.
  };
  
  // Styles for the active tab, extending the base tabStyle with additional properties.
  const activeTabStyle = {
    ...tabStyle,
    borderBottom: '2px solid #43708f', // Adds a bottom border to indicate the tab is active.
    fontWeight: 'bold', // Makes the tab text bold.
  };

  // Environment variables for WebSocket and API endpoints.
  const wsEndpoint = process.env.REACT_APP_WS_ENDPOINT; // WebSocket endpoint URL.
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT; // API endpoint URL.

  // Effect hook to manage the WebSocket connection lifecycle.
  useEffect(() => {
    if (wsEndpoint) { // Checks if the WebSocket endpoint URL is provided.
      const webSocket = new WebSocket(wsEndpoint); // Creates a new WebSocket connection.
      webSocket.onopen = () => console.log('WebSocket Connected'); // Logs when the WebSocket connection is opened.
      webSocket.onmessage = (event) => console.log('Message from server:', event.data); // Logs messages received from the server.
      webSocket.onerror = (error) => console.log('WebSocket Error', error); // Logs WebSocket errors.
      setWs(webSocket); // Updates the WebSocket state with the new connection.
      return () => webSocket.close(); // Cleanup function to close the WebSocket connection when the component unmounts or the wsEndpoint changes.
    }
  }, [wsEndpoint]);

  // useCallback hook to send a message over the WebSocket connection.
  const sendWebSocketMessage = useCallback((data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data)); // Sends data if the WebSocket is connected.
    else console.log('WebSocket is not connected.'); // Logs if the WebSocket is not connected.
  }, [ws]); // Dependencies array includes ws to ensure the function is updated if ws changes.

  // useCallback hook to handle sending a message, either text or audio.
  const handleSendMessage = useCallback((message: string, audioBlob?: Blob) => {
    if (message.trim()) { // Checks if the message is not just whitespace.
      const newMessage = new MessageDto(Math.random().toString(36).substring(2, 15), true, message, 'text', new Date(), 'sent'); // Creates a new message object for text messages.
      setMessages(messages => [...messages, newMessage]); // Adds the new message to the messages state.
      sendWebSocketMessage({ type: 'text', content: message }); // Sends the message content over the WebSocket.
    } else if (audioBlob) { // Checks if there's an audioBlob provided for audio messages.
      const reader = new FileReader(); // Creates a FileReader to read the audioBlob.
      reader.readAsDataURL(audioBlob); // Reads the audioBlob as a data URL.
      reader.onloadend = () => {
        sendWebSocketMessage({ type: 'audio', content: reader.result }); // Sends the audio content over the WebSocket after reading is complete.
      };
    }
  }, [sendWebSocketMessage]); // Dependencies array includes sendWebSocketMessage to ensure the function is updated if it changes.

  // useCallback hook for sending an email with the chat history.
  const onSendEmail = useCallback(() => {
    if (apiEndpoint && messages.length > 0 && user?.username) { // Checks if the API endpoint is set, there are messages, and the user is defined.
      const emailContent = messages.map(msg => `${msg.isUser ? 'User' : 'sAIge'}: ${msg.content}`).join('\n'); // Formats the messages for the email content.

      // Fetch API call to send the email.
      fetch(apiEndpoint, {
        method: 'POST', // HTTP method.
        headers: {
          'Content-Type': 'application/json', // Content type header.
        },
        body: JSON.stringify({
          email: user.username, // Email address to send to.
          content: emailContent, // Email content.
        }),
      })
      .then(response => response.json()) // Parses the JSON response.
      .then(data => {
        console.log('Email sent successfully', data); // Logs on successful email send.
      })
      .catch(error => {
        console.error('Error sending email', error); // Logs if there's an error sending the email.
      });
    }
  }, [apiEndpoint, messages, user?.username]); // Dependencies array includes apiEndpoint, messages, and user.username.

  // useCallback hook for switching the theme.
  const switchTheme = useCallback((themeName: ThemeName) => {
    const newTheme = colorSchemes[themeName]; // Finds the new theme by themeName.
    setTheme(newTheme); // Sets the new theme.
  }, []); // Empty dependencies array indicates this callback does not depend on any state or props and will not be recreated.

  // The component's render method returns JSX for the app UI.
  return (
    <div className="chat-app-wrapper" style={{ /* Your wrapper styles */ }}>
      {/* Conditionally renders the Navbar if the user is authenticated. */}
      {isAuthenticated && <Navbar user={user} onSignOut={() => setIsAuthenticated(false)} isAuthenticated={isAuthenticated} currentThemeName={theme.name as ThemeName} switchTheme={switchTheme} />}
      {/* Conditionally renders the chat UI or authentication forms based on isAuthenticated state. */}
      {isAuthenticated ? (
        <>
          <Chat messages={messages} theme={theme} /> {/* Renders the Chat component passing messages and theme as props. */}
          <ChatInput isWaiting={isWaiting} onSendMessage={handleSendMessage} onSendEmail={onSendEmail} theme={theme} /> {/* Renders the ChatInput component. */}
        </>
      ) : (
        <div className="auth-overlay">
          <div className="auth-tabs">
            {/* Renders sign-in and sign-up tabs with onClick handlers to switch tabs. */}
            <span style={activeTab === 'signIn' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('signIn')}>Sign In</span>
            &nbsp;|&nbsp;
            <span style={activeTab === 'signUp' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('signUp')}>Sign Up</span>
          </div>
          {/* Conditionally renders the SignIn or SignUp component based on activeTab state. */}
          {activeTab === 'signIn' ? <SignIn onSignInSuccess={(username) => setIsAuthenticated(true)} /> : <SignUp onSignUpSuccess={(username) => setIsAuthenticated(true)} />}
        </div>
      )}
    </div>
  );
};

export default App; // Exports the App component for use in other parts of the application.
