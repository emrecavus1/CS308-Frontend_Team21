import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { state: product } = useLocation();
  const { addToCart } = useCart();

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleAddComment = () => {
    if (commentInput.trim() && rating > 0) {
      setComments([...comments, { text: commentInput.trim(), rating }]);
      setCommentInput("");
      setRating(0);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-detail-page">
      <div className="product-info">
        <img src={product.image} alt={product.title} className="product-image" />
        <div className="details">
          <h2>{product.title}</h2>
          <p className="price">${product.price}</p>
          <p className="desc">
            {product.description || "No detailed description available."}
          </p>
          <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>

      <div className="comment-section">
        <h3>Comments</h3>
        <div className="comment-list">
          {comments.map((c, i) => (
            <div key={i} className="comment-item">
              <div className="stars">
                {"★".repeat(c.rating)}
                {"☆".repeat(5 - c.rating)}
              </div>
              <p>🗨️ {c.text}</p>
            </div>
          ))}
        </div>

        <div className="comment-form">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                className={`star ${n <= (hoverRating || rating) ? "filled" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleAddComment}>Post Comment</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;