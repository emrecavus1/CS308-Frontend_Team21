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

  // start with any router‐passed data, then fill in from API
  const [product, setProduct] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error,   setError]   = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // if we already have full data from state (unlikely),
    // skip re‐fetch. Otherwise, always fetch fresh:
    if (state && state.serialNumber) {
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

  return (
    <div className="product-detail-page">
      <Header />

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-container">
        <h2 className="detail-title">{product.productName}</h2>

        <dl className="detail-list">
          <dt>Product ID</dt>
          <dd>{product.productId}</dd>

          <dt>Serial Number</dt>
          <dd>{product.serialNumber}</dd>

          <dt>Category ID</dt>
          <dd>{product.categoryId}</dd>

          <dt>Price</dt>
          <dd>${product.price.toFixed(2)}</dd>

          <dt>Stock Count</dt>
          <dd>{product.stockCount}</dd>

          <dt>Rating</dt>
          <dd>{product.rating}</dd>

          <dt>Product Info</dt>
          <dd>{product.productInfo}</dd>

          <dt>Warranty Status</dt>
          <dd>{product.warrantyStatus}</dd>

          <dt>Distributor Info</dt>
          <dd>{product.distributorInfo}</dd>
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

      {/* …your comments UI here… */}
    </div>
  );
}
