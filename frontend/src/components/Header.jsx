// src/components/Header.jsx
import React from "react";
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h2 className="logo">Shipshak.com</h2>
      <div className="right-container">
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <FaSearch className="search-icon" />
        </div>
        <div className="icons">
          <FaHeart className="icon" />
          <FaShoppingCart className="icon" />
          <FaUser className="icon" onClick={() => navigate("/login")} />
        </div>
      </div>
    </header>
  );
};

export default Header;
