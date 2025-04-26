import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`, { state: product });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(
        `http://localhost:8080/api/main/cart/add?productId=${product.productId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      setMessage(data.message || "");       // capture backend message
    } catch (err) {
      console.error("Failed to add product to cart:", err);
      setMessage("Failed to add product to cart.");
    }
  };

  const inStock = product.stockCount > 0;

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="image-container">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.productName}
        />
      </div>
      <div className="product-info">
        <h3>{product.productName}</h3>
        <p>${product.price.toFixed(2)}</p>
        <p className="stock">
          {inStock
            ? `In stock: ${product.stockCount}`
            : "Out of stock"}
        </p>

        {inStock ? (
          <button onClick={handleAddToCart}>Add to Cart</button>
        ) : (
          <button disabled className="disabled">
            Out of Stock
          </button>
        )}

        {/* display the backend's message */}
        {message && <p className="cart-message">{message}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
