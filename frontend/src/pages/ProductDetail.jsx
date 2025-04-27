// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  // 1) Product state
  const [product, setProduct] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState("");

  // 2) Cart message
  const [message, setMessage] = useState("");

  // 3) Comments (verified reviews)
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadComments] = useState(true);
  const [commentsError, setCommentsError] = useState("");

  // 4) New-comment form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  // 5) Username mapping
  const [userNames, setUserNames] = useState({});

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const name = localStorage.getItem("userName");
  const surname = localStorage.getItem("userSurname");

  // ── Load the full product (unless already in router state) ──
  useEffect(() => {
    if (state?.productId === productId && state.productName) {
      setProduct(state);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/main/products/${productId}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setProduct(data))
      .catch(() => setError("Could not load product."))
      .finally(() => setLoading(false));
  }, [productId, state]);

  // ── Load only verified comments for this product ──
  useEffect(() => {
    setLoadComments(true);
    fetch(`/api/main/product/${productId}/verified`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(async (data) => {
        setComments(data);

        // Load missing usernames
        const uniqueUserIds = [...new Set(data.map(c => c.userId))]
          .filter(uid => !userNames[uid] && uid !== userId);

        const promises = uniqueUserIds.map(uid =>
          fetch(`http://localhost:8080/api/auth/user/${uid}`)
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(userData => ({ uid, name: `${userData.name} ${userData.surname}` }))
            .catch(() => ({ uid, name: uid }))
        );

        const results = await Promise.all(promises);
        const newMapping = {};
        results.forEach(r => {
          newMapping[r.uid] = r.name;
        });
        setUserNames(prev => ({ ...prev, ...newMapping }));

      })
      .catch(() => setCommentsError("Could not load comments."))
      .finally(() => setLoadComments(false));
  }, [productId]);

  if (loading) return <p className="center">Loading…</p>;
  if (error) return <p className="center error">{error}</p>;

  const inStock = product.stockCount > 0;

  // ── Add to cart handler ──
  const handleAddToCart = async () => {
    try {
      const res = await fetch(
        `/api/main/cart/add?productId=${product.productId}`,
        { method: "POST", credentials: "include" }
      );
      const json = await res.json();
      setMessage(json.message || "Added to cart!");
    } catch {
      setMessage("Failed to add product to cart.");
    }
  };

  // ── Submit a new comment ──
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!token || !userId) {
      return alert("Please log in to post a comment.");
    }
    setPosting(true);
    try {
      await fetch("/api/main/postReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          userId,
          rating: newRating,
          comment: newComment
        })
      });

      // After successful post, clear the form only (don't add directly to comments)
      setNewRating(5);
      setNewComment("");

      // Re-fetch comments to get only approved ones
      setLoadComments(true);
      fetch(`/api/main/product/${productId}/verified`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(setComments)
        .catch(() => setCommentsError("Could not load comments."))
        .finally(() => setLoadComments(false));

    } catch {
      alert("Failed to post comment.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="product-detail-page">
      <Header />

      <button className="back-btn" onClick={() => navigate(-1)}> ← Back </button>

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
          <dt>Review IDs</dt>
          <dd>
            {Array.isArray(product.reviewIds) && product.reviewIds.length > 0
              ? product.reviewIds.join(", ")
              : "None"}
          </dd>
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

      {/* ── Comments Section ── */}
      <div className="reviews-section">
        <h3 className="section-title">Comments</h3>

        {loadingComments
          ? <p>Loading comments…</p>
          : commentsError
            ? <p className="error">{commentsError}</p>
            : comments.length === 0
              ? <p>No comments yet.</p>
              : comments.map(c => (
                <div key={c.reviewId} className="review-card">
                  <p>
                    <strong>
                      {c.userId === userId
                        ? `${name} ${surname}`
                        : (userNames[c.userId] || c.userId)}
                    </strong>
                    <span className="comment-rating">({c.rating}/5)</span>
                  </p>
                  <p>{c.comment}</p>
                </div>
              ))
        }

        <form className="review-form" onSubmit={handlePostComment}>
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
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            required
          />

          <button
            className="review-submit"
            type="submit"
            disabled={posting}
          >
            {posting ? "Posting…" : "Post Comment"}
          </button>
        </form>
      </div>
    </div>
  );
}