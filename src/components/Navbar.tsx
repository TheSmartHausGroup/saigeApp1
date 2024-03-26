// src/components/Navbar.tsx
import React from 'react';

interface NavbarProps {
  username: string;
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onSignOut }) => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="welcome-message">Welcome, {username}!</div>
        <button onClick={onSignOut} className="sign-out-btn">Sign Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
