import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart }      from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const inStock = product.stockCount > 0;

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`, { state: product });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (inStock) addToCart(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* no image at all */}
      <div className="product-info">
        <h3>{product.productName}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="stock">
          {inStock ? `In stock: ${product.stockCount}` : "Out of stock"}
        </p>
        <button
          onClick={handleAddToCart}
          className={inStock ? "add-btn" : "add-btn disabled"}
          disabled={!inStock}
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
