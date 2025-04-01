import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: product });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // <-- yönlendirmeyi engelle
    addToCart(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="image-container">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <h3>{product.title}</h3>
        <p>${product.price.toFixed(2)}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;