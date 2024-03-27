// src/components/Navbar.tsx
import React from 'react';

interface NavbarProps {
  isAuthenticated: boolean;
  user: { username: string } | null;
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onSignOut }) => {
  return (
    <div className="navbar">
      <div className="navbar-content">
        {user ? (
          <>
            <div className="welcome-message">Welcome, {user.username}!</div>
            <button onClick={onSignOut} className="sign-out-btn">Sign out</button>
          </>
        ) : (
          // Optionally, display something else when no user is logged in
          <div className="placeholder-content"></div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
