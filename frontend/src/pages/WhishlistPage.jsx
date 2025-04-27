// src/pages/WishlistPage.jsx
import React from "react";
import Header from "../components/Header";
import "./WishlistPage.css"; // İstersen ayrı CSS de açarız

export default function WishlistPage() {
  return (
    <div className="wishlist-page">
      <Header />
      <div style={{ height: "80px" }}></div> {/* Header boşluğu */}
      
      <h1 className="wishlist-title">Your Wishlist</h1>
      <p className="wishlist-info">You don't have any favorite products yet.</p>
    </div>
  );
}