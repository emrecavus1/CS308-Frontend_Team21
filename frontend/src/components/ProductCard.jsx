// src/components/ProductCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);

  const inStock = product.stockCount > 0;

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`, { state: product });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!inStock || adding) return;

    setAdding(true);
    try {
      const res = await fetch(`/api/main/cart/add?productId=${product.productId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setMessage(json.message || "Added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      setMessage("Failed to add to cart.");
    } finally {
      setAdding(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // 🌟 BURASI YENİ EKLENEN KISIM: Resim yolu
  const imageName = product.productName.replace(/\s+/g, "_") + ".jpg";  // Boşlukları _ yap
  const imagePath = `/assets/product-images/${imageName}`;

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Ürün resmi */}
      <img
        src={imagePath}
        alt={product.productName}
        className="product-image"
        onError={(e) => { e.target.src = "/assets/product-images/placeholder.jpg"; }}
      />

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
          {inStock
            ? adding ? "Adding…" : "Add to Cart"
            : "Out of Stock"}
        </button>

        {message && <p className="cart-message">{message}</p>}
      </div>
    </div>
  );
}