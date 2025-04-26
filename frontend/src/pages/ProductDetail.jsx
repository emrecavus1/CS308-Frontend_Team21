// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();

  // If someone landed here directly (no router state), state === undefined.
  // We'll treat that as "loading" until we fetch the full product.
  const [product, setProduct] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error,   setError]   = useState("");
  const [message, setMessage] = useState("");

  // If we got a productId from state, fetch the full record
  useEffect(() => {
    if (!state?.productId) return;

    setLoading(true);
    fetch(`http://localhost:8080/api/main/products/${state.productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch(() => setError("Could not load product details."))
      .finally(() => setLoading(false));
  }, [state]);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="error">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const inStock = product.stockCount > 0;

  return (
    <div className="product-detail-page">
      <Header />

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-info">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.productName}
          className="product-image"
        />

        <div className="details">
          <h2>{product.productName}</h2>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="stock">
            {inStock ? `In stock: ${product.stockCount}` : "Out of stock"}
          </p>
          <p className="desc">
            {product.productInfo || product.description || "No detailed description available."}
          </p>

          <button
            onClick={async () => {
              try {
                const res = await fetch(
                  `http://localhost:8080/api/main/cart/add?productId=${product.productId}`,
                  { method: "POST", credentials: "include" }
                );
                const json = await res.json();
                setMessage(json.message);
              } catch {
                setMessage("Failed to add product to cart.");
              }
            }}
            disabled={!inStock}
            className={inStock ? "add-btn" : "disabled"}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          {message && <p className="cart-message">{message}</p>}
        </div>
      </div>

      {/* …rest of your comments UI… */}
    </div>
  );
};

export default ProductDetail;
