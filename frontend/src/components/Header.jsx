// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // optional local CSS or just rely on global styles

function Header() {
  return (
    <header className="site-header">
      <div className="header-logo">
        <Link to="/">Shipshak.com</Link>
      </div>
      <nav className="header-nav">
        {/* Add or remove links as needed */}
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
      </nav>
    </header>
  );
}

export default Header;
