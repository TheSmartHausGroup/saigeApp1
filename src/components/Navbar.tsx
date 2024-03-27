import React from 'react';
import { colorSchemes, ThemeName } from '../components/colorScheme'; // Make sure the path is correct

interface NavbarProps {
  isAuthenticated: boolean;
  user: { username: string } | null;
  onSignOut: () => void;
  switchTheme: (themeName: ThemeName) => void;
  currentThemeName: ThemeName;
}

const Navbar: React.FC<NavbarProps> = ({ user, onSignOut, switchTheme, currentThemeName }) => {
  return (
    <div className="navbar">
      {user && (
        <>
          <div className="welcome-message">
            <h1>Welcome, {user.username}!</h1>
          </div>
          {/* Updated select element here */}
          <select onChange={(e) => switchTheme(e.target.value as ThemeName)} value="">
            {/* Default option */}
            <option value="" disabled>
              Change Theme
            </option>
            {/* Map over your themes */}
            {Object.keys(colorSchemes).map((key) => (
              <option key={key} value={key}>
                {colorSchemes[key as keyof typeof colorSchemes].name}
              </option>
            ))}
          </select>
          <button onClick={onSignOut} className="sign-out-btn">
            Sign out
          </button>
        </>
      )}
    </div>
  );
};

export default Navbar;