// Import necessary modules and components for the application.
import React, { useState, useCallback, useEffect } from 'react'; // Importing React and its hooks.
import Chat from './components/Chat'; // Importing the Chat component.
import ChatInput from './components/ChatInput'; // Importing the ChatInput component.
import SignIn from './components/SignIn'; // Importing the SignIn component.
import SignUp from './components/SignUp'; // Importing the SignUp component.
import Navbar from './components/Navbar'; // Importing the Navbar component.
import { MessageDto } from './models/MessageDto'; // Importing the MessageDto model.
import { colorSchemes, defaultTheme, Theme, ThemeName } from './components/colorScheme'; // Importing theming utilities.
import './index.css'; // Importing global styles.

// App component encapsulates the entire chat application logic and rendering.
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // State for tracking authentication.
  const [user, setUser] = useState<{ username: string } | null>(null); // State for storing user info.
  const [isWaiting, setIsWaiting] = useState<boolean>(false); // State for indicating waiting status (e.g., loading).
  const [messages, setMessages] = useState<Array<MessageDto>>([ // State for storing chat messages.
    new MessageDto('welcome-msg', false, 'What can we do together today?', 'text', new Date(), 'sent'), // Default welcome message.
  ]);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn'); // State for controlling the active tab in the auth overlay.
  const [theme, setTheme] = useState<Theme>(defaultTheme); // State for the current theme, initially set to default.
  const [ws, setWs] = useState<WebSocket | null>(null); // State for managing WebSocket connection.

  // Style objects for the tabs in the auth overlay.
  const tabStyle = { cursor: 'pointer', padding: '10px', marginRight: '10px', color: '#43708f' }; // Base style for tabs.
  const activeTabStyle = { ...tabStyle, borderBottom: '2px solid #43708f', fontWeight: 'bold' }; // Style for the active tab.

  // Effect hook to initialize and manage WebSocket connection.
  useEffect(() => {
    const wsEndpoint = process.env.REACT_APP_WS_ENDPOINT; // Getting WebSocket endpoint from environment variables.
    if (wsEndpoint) {
      const webSocket = new WebSocket(wsEndpoint); // Initializing WebSocket connection.
      webSocket.onopen = () => console.log('WebSocket Connected'); // Logging successful connection.
      webSocket.onmessage = (event) => console.log('Message from server:', event.data); // Handling messages from server.
      webSocket.onerror = (error) => console.log('WebSocket Error', error); // Handling WebSocket errors.
      setWs(webSocket); // Storing WebSocket connection in state.
      return () => webSocket.close(); // Cleanup function to close WebSocket on component unmount.
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render.

  // Callback to send messages via WebSocket.
  const sendWebSocketMessage = useCallback((data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data)); // Sending message if WebSocket is connected.
    } else {
      console.log('WebSocket is not connected.'); // Logging when WebSocket is not connected.
    }
  }, [ws]); // Depend on the WebSocket state to ensure the callback is updated if the connection changes.

  // Handles sending of user messages.
  const handleSendMessage = useCallback((message: string, audioBlob?: Blob) => {
    if (message.trim()) {
      const newMessage = new MessageDto(Math.random().toString(36).substring(2, 15), true, message, 'text', new Date(), 'sent');
      setMessages(messages => [...messages, newMessage]); // Adding new message to state.
      sendWebSocketMessage({ type: 'text', content: message }); // Sending text message over WebSocket.
    } else if (audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob); // Converting audio blob to data URL.
      reader.onloadend = () => sendWebSocketMessage({ type: 'audio', content: reader.result }); // Sending audio message on reader load end.
    }
  }, [sendWebSocketMessage]); // Depend on the sendWebSocketMessage callback.

  // Callback for sending email with chat history.
  const onSendEmail = useCallback(() => {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT; // API endpoint for sending emails.
    if (apiEndpoint && messages.length > 0 && user?.username) {
      const emailContent = messages.map(msg => `${msg.isUser ? 'User' : 'sAIge'}: ${msg.content}`).join('\n'); // Compiling email content.
      fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.username, content: emailContent }),
      }) // Sending email via API.
        .then(response => response.json()) // Parsing JSON response.
        .then(data => console.log('Email sent successfully', data)) // Logging success.
        .catch(error => console.error('Error sending email', error)); // Logging errors.
    }
  }, [messages, user?.username]); // Depend on messages and user state.

  // Callback to switch the app's theme.
  const switchTheme = useCallback((themeName: ThemeName) => {
    setTheme(colorSchemes[themeName]); // Updating the theme state with the selected theme.
  }, []); // Empty dependency array means this callback doesn't depend on any state or props.

  // Render function for the App component.
  return (
      <div className="chat-app-wrapper" style={{
        backgroundColor: theme.backgroundColor,
        backgroundImage: theme.isImage ? `url(${theme.backgroundImage})` : 'none',
    }}> {/* Wrapper for the entire chat application. */}
      {isAuthenticated && <Navbar user={user} onSignOut={() => setIsAuthenticated(false)} isAuthenticated={isAuthenticated} currentThemeName={theme.name as ThemeName} switchTheme={switchTheme} />} {/* Navbar, shown if authenticated. */}
      {isAuthenticated ? (
        <>
          <Chat messages={messages} theme={theme} /> {/* Chat component for displaying messages. */}
          <ChatInput isWaiting={isWaiting} onSendMessage={handleSendMessage} onSendEmail={onSendEmail} theme={theme} /> {/* Input component for sending messages. */}
        </>
      ) : (
        <div className="auth-overlay"> {/* Authentication overlay for sign-in/up forms. */}
          <div className="auth-tabs"> {/* Tabs for switching between sign-in and sign-up. */}
            <span style={activeTab === 'signIn' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('signIn')}>Sign In</span> {/* Sign-in tab. */}
            &nbsp;|&nbsp; {/* Separator for readability. */}
            <span style={activeTab === 'signUp' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('signUp')}>Sign Up</span> {/* Sign-up tab. */}
          </div>
          {activeTab === 'signIn' ? <SignIn onSignInSuccess={(username) => { setIsAuthenticated(true); setUser({username}); }} /> : <SignUp onSignUpSuccess={(username) => { setIsAuthenticated(true); setUser({username}); }} />} {/* Renders SignIn or SignUp component based on active tab. */}
        </div>
      )}
    </div>
  );
};

export default App; // Exporting the App component for use in the application.
