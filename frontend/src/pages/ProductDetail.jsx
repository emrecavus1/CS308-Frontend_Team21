// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import Header from "../components/Header";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate      = useNavigate();
  const { state }     = useLocation();

  // product loading state
  const [product, setProduct] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error,   setError]   = useState("");

  // cart message
  const [message, setMessage] = useState("");

  // reviews state
  const [reviews, setReviews]           = useState([]);
  const [reviewsLoading, setRevLoading] = useState(true);
  const [revError, setRevError]         = useState("");

  // new-review form
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText]     = useState("");
  const [posting, setPosting]     = useState(false);

  const token  = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  // 1) load product if not in state
  useEffect(() => {
    if (state && state.productId === productId && state.productName) {
      setProduct(state);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8080/api/main/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then(data => {
        setProduct({
          productId:      data.productId,
          productName:    data.productName,
          serialNumber:   data.serialNumber,
          categoryId:     data.categoryId,
          price:          data.price,
          stockCount:     data.stockCount,
          rating:         data.rating,
          productInfo:    data.productInfo,
          warrantyStatus: data.warrantyStatus,
          distributorInfo:data.distributorInfo
        });
      })
      .catch(() => setError("Could not load product details."))
      .finally(() => setLoading(false));
  }, [productId, state]);

  // 2) fetch verified reviews
  useEffect(() => {
    setRevLoading(true);
    setRevError("");
    fetch(`http://localhost:8080/api/main/product/${productId}/verified`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setReviews(data))
      .catch(() => setRevError("Could not load reviews."))
      .finally(() => setRevLoading(false));
  }, [productId]);

  if (loading) return <p className="center">Loading…</p>;
  if (error)   return <p className="center error">{error}</p>;
  if (!product) return <p className="center error">Product not found.</p>;

  const inStock = product.stockCount > 0;

  const handleAddToCart = async () => {
    try {
      const res  = await fetch(
        `http://localhost:8080/api/main/cart/add?productId=${product.productId}`,
        { method: "POST", credentials: "include" }
      );
      const json = await res.json();
      setMessage(json.message || "Added to cart!");
    } catch {
      setMessage("Failed to add product to cart.");
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!token || !userId) {
      alert("Please log in to post a review.");
      return;
    }
    setPosting(true);
    try {
      const resp = await fetch(
        "http://localhost:8080/api/main/postReview",
        {
          method: "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            productId,
            userId,
            rating: newRating,
            commentText: newText
          })
        }
      );
      const saved = await resp.json();
      setReviews(r => [ ...r, saved ]);
      setNewText("");
      setNewRating(5);
    } catch {
      alert("Failed to post review.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="product-detail-page">
      <Header />

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-container">
        <h2 className="detail-title">{product.productName}</h2>

        <dl className="detail-list">
          <dt>Product ID</dt><dd>{product.productId}</dd>
          <dt>Serial Number</dt><dd>{product.serialNumber}</dd>
          <dt>Category ID</dt><dd>{product.categoryId}</dd>
          <dt>Price</dt><dd>${product.price.toFixed(2)}</dd>
          <dt>Stock Count</dt><dd>{product.stockCount}</dd>
          <dt>Rating</dt><dd>{product.rating}</dd>
          <dt>Product Info</dt><dd>{product.productInfo}</dd>
          <dt>Warranty Status</dt><dd>{product.warrantyStatus}</dd>
          <dt>Distributor Info</dt><dd>{product.distributorInfo}</dd>
        </dl>

        <button
          className={`add-btn ${!inStock ? "disabled" : ""}`}
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
        {message && <p className="cart-message">{message}</p>}
      </div>

      {/* ── Reviews ── */}
      <div className="reviews-section">
        <h3 className="section-title">Reviews</h3>
        {reviewsLoading
          ? <p>Loading reviews…</p>
          : revError
            ? <p className="error">{revError}</p>
            : reviews.length === 0
              ? <p>No reviews yet.</p>
              : reviews.map(r => (
                  <div key={r.reviewId} className="review-card">
                    <p><strong>{r.userName || r.userId}</strong> – {r.rating}/5</p>
                    <p>{r.commentText}</p>
                  </div>
                ))
        }

        <form className="review-form" onSubmit={handlePostReview}>
          <h4 className="section-title">Leave a Review</h4>

          <div className="star-rating">
            {[1,2,3,4,5].map(i => (
              <span
                key={i}
                className={i <= newRating ? "star filled" : "star"}
                onClick={() => setNewRating(i)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            className="review-text"
            placeholder="Your comments…"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            required
          />

          <button className="review-submit" type="submit" disabled={posting}>
            {posting ? "Posting…" : "Post Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
