import React from 'react';
import { colorSchemes, ThemeName } from '../components/colorScheme'; // Import the type for theme names

interface NavbarProps {
  isAuthenticated: boolean;
  user: { username: string } | null;
  onSignOut: () => void;
  switchTheme: (themeName: ThemeName) => void; // Function to switch themes
  currentThemeName: ThemeName; // Current active theme name
}

const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, switchTheme, currentThemeName }) => {
  return (
    <div className="navbar">
      {user && (
        <>
          <div className="welcome-message">
            <h1>Welcome, {user.username}!</h1>
          </div>
          {/* Theme switcher dropdown */}
          <select value={currentThemeName} onChange={(e) => switchTheme(e.target.value as ThemeName)}>
            {Object.keys(colorSchemes).map(key => (
              <option key={key} value={key}>{colorSchemes[key as keyof typeof colorSchemes].name}</option>
            ))}
          </select>
          {/* Sign-out button */}
          <button onClick={onSignOut} className="sign-out-btn">Sign out</button>
        </>
      )}
    </div>
  );
};

export default Navbar;