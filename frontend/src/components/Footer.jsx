// src/components/Footer.jsx
import React from "react";
import "./Footer.css"; // or use global

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-section">
        <h3>Exclusive</h3>
        <p>Get 10% off your first order</p>
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
        <h3>Quick Links</h3>
        <p>Privacy Policy</p>
        <p>Terms of Use</p>
        <p>FAQ</p>
      </div>
      <div className="footer-section">
        <h3>Download App</h3>
        <p>[QR code here]</p>
      </div>
    </footer>
  );
}

export default Footer;
