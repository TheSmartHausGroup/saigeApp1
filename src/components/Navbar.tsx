// src/components/Navbar.tsx
import React from 'react';

interface NavbarProps {
  user: { username: string } | null;
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onSignOut }) => {
  return (
    <div className="navbar">
      <div className="welcome-message">
        {user && <h1>Welcome, {user.username}!</h1>}
      </div>
      {user && (
        <button onClick={onSignOut} className="sign-out-button">
          Sign out
        </button>
      )}
    </div>
  );
};

export default Navbar;
