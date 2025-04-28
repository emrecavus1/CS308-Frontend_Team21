// src/components/ProductCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Heart icons
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(false); // Local wishlist state

  const inStock = product.stockCount > 0;
  const userId = localStorage.getItem("userId");

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`, { state: product });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!inStock || adding) return;

    setAdding(true);
    try {
      const res = await fetch(
        `/api/main/cart/add?productId=${product.productId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const json = await res.json();
      if (res.ok) {
        setMessage(json.message || "Added to cart!");
      } else {
        setMessage(json.message || "Failed to add to cart.");
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      setMessage("Failed to add to cart.");
    } finally {
      setAdding(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!userId) {
      alert("Please log in to use wishlist.");
      return;
    }

    try {
      if (!inWishlist) {
        // Try adding to wishlist
        const res = await fetch(`/api/main/${userId}/wishlist/${product.productId}`, {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          setInWishlist(true);
        } else {
          console.error("Failed to add to wishlist.");
        }
      } else {
        // Try removing from wishlist
        const res = await fetch(`/api/main/${userId}/wishlist/${product.productId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setInWishlist(false);
        } else {
          console.error("Failed to remove from wishlist.");
        }
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Heart icon - filled if inWishlist */}
      <div className="wishlist-icon" onClick={handleToggleWishlist}>
        {inWishlist ? <FaHeart className="heart filled" /> : <FaRegHeart className="heart" />}
      </div>

      <div className="product-info">
        <h3>{product.productName}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="stock">
          {inStock ? `In stock: ${product.stockCount}` : "Out of stock"}
        </p>

        <button
          onClick={handleAddToCart}
          className={inStock ? "add-btn" : "add-btn disabled"}
          disabled={!inStock || adding}
        >
          {inStock ? (adding ? "Adding…" : "Add to Cart") : "Out of Stock"}
        </button>

        {message && <p className="cart-message">{message}</p>}
      </div>
    </div>
  );
}
