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
<div className="navbar">
  {user && (
    <>
      <div className="welcome-message">
        Welcome, {user.username}!
      </div>
          <div className="theme-switcher">
            <label htmlFor="themeSelect" className="theme-label">
              Change theme:
            </label>
            <select 
              id="themeSelect" 
              className="theme-select"
              onChange={(e) => switchTheme(e.target.value as ThemeName)}
              value={currentThemeName}
            >
              {Object.keys(colorSchemes).map((key) => (
                <option key={key} value={key}>
                  {colorSchemes[key as keyof typeof colorSchemes].name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={onSignOut} className="sign-out-btn">
            Sign out
          </button>
        </>
      )}
    </div>
  );
};

export default Navbar; // Exports the Navbar component for use in other parts of the application.
