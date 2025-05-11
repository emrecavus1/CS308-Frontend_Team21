// src/pages/Wishlist.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { FaHeart, FaRegHeart } from "react-icons/fa";  // Import icons
import "./Wishlist.css";

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [message, setMessage] = useState("");


  const tabId = sessionStorage.getItem("tabId");
  const userId = sessionStorage.getItem(`${tabId}-userId`);
  

  useEffect(() => {
    if (!userId) {
      setError("Please log in to view your wishlist.");
      setLoading(false);
      return;
    }

    fetch(`/api/main/${userId}/wishlist`, { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setProducts(data || []))
      .catch(() => setError("Failed to load wishlist."))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleRemoveFromWishlist = async (productId) => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/main/${userId}/wishlist/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        // remove the product from local UI immediately
        setProducts(prev => prev.filter(p => p.productId !== productId));
      } else {
        console.error("Failed to remove from wishlist");
      }
    } catch (err) {
      console.error("Error while removing from wishlist:", err);
    }
  };

  const getTabCartIdFromCookie = () => {
    const match = document.cookie.match(/TAB_CART_ID=([^;]+)/);
    return match ? match[1] : null;
  };

  const handleAddToCart = async (productId) => {
    const tabId = sessionStorage.getItem("tabId");
  
    try {
      const res = await fetch(
        `/api/main/cart/add?productId=${productId}&tabId=${tabId}`,
        {
          method: "POST",
          credentials: "include"
        }
      );
      const json = await res.json();
      if (res.ok) {
        const cartId = getTabCartIdFromCookie(); // now should exist
        console.log("Cart ID for this tab:", cartId);
        setMessage(json.message || "✅ Added to cart!");
      } else {
        setMessage(json.message || "❌ Failed to add to cart.");
      }
    } catch (err) {
      setMessage("❌ Failed to add to cart.");
      console.error("Add to cart failed:", err);
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };
  
  
  
  

  return (
    <div className="wishlist-page">
      <Header />

      <h1 className="wishlist-title">Your Wishlist</h1>
      {message && <p className="status-message">{message}</p>}

      {loading ? (
        <p className="center">Loading…</p>
      ) : error ? (
        <p className="center error">{error}</p>
      ) : products.length === 0 ? (
        <p className="center">Your wishlist is empty.</p>
      ) : (
        <div className="products-grid">
          {products.map(p => (
            <div key={p.productId} className="product-card">
              {/* Heart Icon - Always filled inside wishlist */}
              <div className="wishlist-icon" onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromWishlist(p.productId);
              }}>
                <FaHeart className="heart filled" />
              </div>

              <div className="product-info">
                <h3>{p.productName}</h3>
                <p className="price">${p.price.toFixed(2)}</p>
                <p className="stock">
                  {p.stockCount > 0 ? `In stock: ${p.stockCount}` : "Out of stock"}
                </p>

                <button
                className={p.stockCount > 0 ? "add-btn" : "add-btn disabled"}
                disabled={p.stockCount <= 0}
                onClick={() => handleAddToCart(p.productId)}  // ✅ Attach event
              >
                {p.stockCount > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
