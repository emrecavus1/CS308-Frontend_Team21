import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  // 🟢 Handler for cart click
  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <header className="header">
      <h2 className="logo" onClick={() => navigate("/")}>
        Shipshak.com
      </h2>
      <div className="search-bar">
        <input type="text" placeholder="Search products, categories..." />
        <FaSearch className="search-icon" />
      </div>
      <div className="icons">
        <FaHeart className="icon" />
        <FaShoppingCart className="icon clickable-icon" onClick={handleCartClick} />
        <FaUser
          className="icon clickable-icon"
          onClick={() => navigate("/login")}
        />
      </div>
    </header>
  );
};

export default Header;
