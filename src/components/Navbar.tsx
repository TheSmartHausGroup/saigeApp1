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
        {user && (
          <>
            <div className="welcome-message">
              <h1>Welcome, {user.username}!</h1>
            </div>
            <button onClick={onSignOut} className="sign-out-btn">
              Sign out
            </button>
          </>
        )}
      </div>
    );
  };
  

export default Navbar;
