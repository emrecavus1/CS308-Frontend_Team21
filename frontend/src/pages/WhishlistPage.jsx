import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./WishlistPage.css";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

  return (
    <div className="wishlist-page">
      <Header />
      <div style={{ height: "80px" }}></div>

      <h1 className="wishlist-title">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <p className="wishlist-info">You don't have any favorite products yet.</p>
          <button className="wishlist-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.productId} className="wishlist-card">
              <img
                src={`/assets/product-images/${item.productName.replace(/\s+/g, "_")}.jpg`}
                alt={item.productName}
                onError={(e) => { e.target.src = "/assets/product-images/placeholder.jpg"; }}
              />
              <h3>{item.productName}</h3>
              <p>${item.price.toFixed(2)}</p>
              <button className="remove-btn" onClick={() => handleRemove(item.productId)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}