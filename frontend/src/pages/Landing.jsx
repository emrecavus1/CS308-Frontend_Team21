import React from "react";
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  return (
    <div className="landing-container">
      {/* Header Section */}
      <header className="header">
        <h2 className="logo">Shipshak.com</h2>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <FaSearch className="search-icon" />
        </div>
        <div className="icons">
          <FaHeart className="icon" />
          <FaShoppingCart className="icon" />
          {/* Navigate to login when clicking the profile icon */}
          <FaUser className="icon clickable-icon" onClick={() => navigate("/login")} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Shipshak.com</h1>
          <p>Your cart, your way, right away!</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h3>Categories</h3>
        <div className="category-list">
          <div className="category-item">Clothing</div>
          <div className="category-item">Shoes & Bags</div>
          <div className="category-item">Cosmetics</div>
          <div className="category-item">Electronics</div>
          <div className="category-item">Accessories</div>
          <div className="category-item">Sports & Outdoor</div>
          <div className="category-item">Home & Living</div>
          <div className="category-item">Groceries</div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
