// src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // Make sure this matches the file name & path in your project

function Landing() {
  // Check if user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  return (
    <div className="landing-container">
      {/* HEADER / NAVBAR */}
      <header className="landing-header">
        <div className="logo">Shipshak.com</div>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          {!loggedInUser && <Link to="/register" className="nav-link">Register</Link>}
          {!loggedInUser && <Link to="/login" className="nav-link">Login</Link>}
          {loggedInUser && <Link to="/profile" className="nav-link">Profile</Link>}
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="hero-text">
          <h1>Welcome to Shipshak.com</h1>
          <p>
            Our mission is to impress you (find a little variety and 10% more fun).
            Your order ships right away!
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="landing-main">
        <h2>Categories</h2>
        <div className="landing-categories">
          <button>Clothing</button>
          <button>Shoes and Bags</button>
          <button>Cosmetics</button>
          <button>Electronics</button>
          <button>Accessories</button>
          <button>Sports &amp; Outdoor</button>
          <button>Home &amp; Living</button>
          <button>Groceries</button>
        </div>

        <h2>Fresh on the Market</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="https://via.placeholder.com/120" alt="Product" />
            <p>Organic Vegetables</p>
            <span>$5.99</span>
          </div>
          <div className="product-card">
            <img src="https://via.placeholder.com/120" alt="Product" />
            <p>Fresh Fruits</p>
            <span>$3.19</span>
          </div>
          <div className="product-card">
            <img src="https://via.placeholder.com/120" alt="Product" />
            <p>Grass-fed Beef</p>
            <span>$10.00</span>
          </div>
          <div className="product-card">
            <img src="https://via.placeholder.com/120" alt="Product" />
            <p>Artisanal Bread</p>
            <span>$4.99</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-section">
          <h3>Exclusive</h3>
          <p>Subscribe to get 10% off your first order</p>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="footer-section">
          <h3>Support</h3>
          <p>11 Bihly resort, Dhaka</p>
          <p>on Hills, Bangladesh</p>
          <p>cs@shipshak.com</p>
          <p>+88016-88888-9999</p>
        </div>
        <div className="footer-section">
          <h3>Account</h3>
          <p>My Account</p>
          <p>Login / Register</p>
          <p>Cart</p>
          <p>Wishlist</p>
        </div>
        <div className="footer-section">
          <h3>Quick Link</h3>
          <p>Privacy Policy</p>
          <p>Terms of Use</p>
          <p>FAQ</p>
        </div>
        <div className="footer-section">
          <h3>Download App</h3>
          <p>[ QR code / store links ]</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
