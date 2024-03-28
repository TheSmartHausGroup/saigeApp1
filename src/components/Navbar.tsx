import React from 'react'; // Imports the React library for creating the component.
import { colorSchemes, ThemeName } from '../components/colorScheme'; // Imports the color schemes and ThemeName type for theme management.

// Defines the properties expected by the Navbar component.
interface NavbarProps {
  isAuthenticated: boolean; // Indicates whether the user is authenticated.
  user: { username: string } | null; // User object containing the username, or null if no user is authenticated.
  onSignOut: () => void; // Function to call when the user clicks the sign-out button.
  switchTheme: (themeName: ThemeName) => void; // Function to call when changing the theme.
  currentThemeName: ThemeName; // The name of the currently active theme.
}

// Functional component definition for Navbar, accepting NavbarProps.
const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, switchTheme, currentThemeName }) => {
  return (
    <div className="navbar"> // Wrapper div for the navbar, styled with a CSS class.
      {user && ( // Conditionally renders the content inside if there is a user object.
        <>
          <div className="welcome-message"> // Div for displaying a welcome message.
            <h1>Welcome, {user.username}!</h1> // Displays the user's username in a welcome message.
          </div>
          <select 
            onChange={(e) => switchTheme(e.target.value as ThemeName)} // Handler for changing the theme. Casts the event target value to ThemeName.
            value={currentThemeName} // Sets the select value to the current theme name, making it a controlled component.
          >
            <option value="" disabled> // Disabled option that prompts users to change the theme.
              Change Theme
            </option>
            {Object.keys(colorSchemes).map((key) => ( // Maps over the keys of the colorSchemes object to create an option for each theme.
              <option key={key} value={key}> // Option element for a theme, using the theme key as the value and key prop.
                {colorSchemes[key as keyof typeof colorSchemes].name} // Displays the name of the theme as the option text.
              </option>
            ))}
          </select>
          <button onClick={onSignOut} className="sign-out-btn"> // Button for signing out, with an onClick handler calling onSignOut.
            Sign out
          </button>
        </>
      )}
    </div>
  );
};

export default Navbar; // Exports the Navbar component for use in other parts of the application.
