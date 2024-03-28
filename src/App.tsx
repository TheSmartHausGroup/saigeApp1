// Import necessary modules and components for the application.
import React, { useState, useCallback, useEffect } from 'react'; // React base and hooks for state and lifecycle management.
import Chat from './components/Chat'; // Component for displaying chat messages.
import ChatInput from './components/ChatInput'; // Component for user input in chat.
import SignIn from './components/SignIn'; // Component for user sign-in form.
import SignUp from './components/SignUp'; // Component for user sign-up form.
import Navbar from './components/Navbar'; // Component for the navigation bar.
import { MessageDto } from './models/MessageDto'; // Data model for chat messages.
import { colorSchemes, defaultTheme, Theme, ThemeName } from './components/colorScheme'; // Theming utilities and defaults.
import './index.css'; // Global styles.

// App component encapsulates the entire chat application logic and rendering.
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Tracks user's authentication status.
  const [user, setUser] = useState<{ username: string } | null>(null); // Stores current user's information.
  const [isWaiting, setIsWaiting] = useState<boolean>(false); // Indicates if the app is in a waiting state, e.g., loading.
  const [messages, setMessages] = useState<Array<MessageDto>>([ // Holds chat messages, starting with a default welcome message.
    new MessageDto('welcome-msg', false, 'What can we do together today?', 'text', new Date(), 'sent'),
  ]);
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn'); // Controls active tab in the auth overlay.
  const [theme, setTheme] = useState<Theme>(defaultTheme); // Current theme for the app, can be switched dynamically.
  const [ws, setWs] = useState<WebSocket | null>(null); // Websocket connection instance.

  // Styles for tabs in the auth overlay, allowing users to switch between signing in and up.
  const tabStyle = { cursor: 'pointer', padding: '10px', marginRight: '10px', color: '#43708f', }; // Base style for tabs.
  const activeTabStyle = { ...tabStyle, borderBottom: '2px solid #43708f', fontWeight: 'bold', }; // Style for the active tab.

  // Effect hook to initialize and manage WebSocket connection.
  useEffect(() => {
    const wsEndpoint = process.env.REACT_APP_WS_ENDPOINT; // Endpoint URL for the WebSocket connection.
    if (wsEndpoint) { // Only proceed if the endpoint is defined.
      const webSocket = new WebSocket(wsEndpoint); // Initialize WebSocket connection.
      webSocket.onopen = () => console.log('WebSocket Connected'); // Log on successful connection.
      webSocket.onmessage = (event) => console.log('Message from server:', event.data); // Handle incoming messages.
      webSocket.onerror = (error) => console.log('WebSocket Error', error); // Handle connection errors.
      setWs(webSocket); // Store the WebSocket instance in state.
      return () => webSocket.close(); // Cleanup function to close the connection when the component unmounts.
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render.

  // Callback to send messages via WebSocket.
  const sendWebSocketMessage = useCallback((data: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) { ws.send(JSON.stringify(data)); } // Send message if connected.
    else { console.log('WebSocket is not connected.'); } // Log if the WebSocket is not connected.
  }, [ws]); // Depend on the WebSocket state to ensure the callback is updated if the connection changes.

  // Handles user message sending, including text and optional audio.
  const handleSendMessage = useCallback((message: string, audioBlob?: Blob) => {
    if (message.trim()) { // Check for non-empty text messages.
      const newMessage = new MessageDto(Math.random().toString(36).substring(2, 15), true, message, 'text', new Date(), 'sent');
      setMessages(messages => [...messages, newMessage]); // Add new message to state.
      sendWebSocketMessage({ type: 'text', content: message }); // Send text message over WebSocket.
    } else if (audioBlob) { // Handle audio messages.
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob); // Convert audio blob to data URL.
      reader.onloadend = () => sendWebSocketMessage({ type: 'audio', content: reader.result }); // Send audio message.
    }
  }, [sendWebSocketMessage]); // Depend on the sendWebSocketMessage callback.

  // Callback for sending email with chat history.
  const onSendEmail = useCallback(() => {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT; // API endpoint for sending emails.
    if (apiEndpoint && messages.length > 0 && user?.username) { // Ensure prerequisites are met.
      const emailContent = messages.map(msg => `${msg.isUser ? 'User' : 'sAIge'}: ${msg.content}`).join('\n'); // Compile email content.
      fetch(apiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ email: user.username, content: emailContent, }), }) // Send email via API.
      .then(response => response.json()) // Parse JSON response.
      .then(data => console.log('Email sent successfully', data)) // Log success.
      .catch(error => console.error('Error sending email', error)); // Log errors.
    }
  }, [messages, user?.username]); // Depend on messages and user state.

// Callback to switch the app's theme.
const switchTheme = useCallback((themeName: ThemeName) => {
  console.log("Switching to theme:", themeName); // Log the theme being switched to
  setTheme(colorSchemes[themeName]); // Update the theme state with the selected theme
  console.log("New theme set:", colorSchemes[themeName]); // Optionally log the new theme object for verification
}, []);


  // Render function for the App component.
  return (
    <div className="chat-app-wrapper"> {/* Wrapper for the entire chat application. */}
      {isAuthenticated && <Navbar user={user} onSignOut={() => setIsAuthenticated(false)} isAuthenticated={isAuthenticated} currentThemeName={theme.name as ThemeName} switchTheme={switchTheme} />} {/* Navbar, shown if authenticated. */}
      {isAuthenticated ? ( /* Conditional rendering based on authentication status. */
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

export default App; // Export the App component for use in the application.
