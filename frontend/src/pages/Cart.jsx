// src/pages/Cart.jsx
import React, { useState, useEffect } from "react";
import { useNavigate }               from "react-router-dom";
import Header                        from "../components/Header";
import "./Cart.css";

export default function Cart() {
  const [items,   setItems]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/main/items", {
      credentials: "include",    // ← sends your CART_ID cookie automatically
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(async (rawItems) => {
        // enrich each item with productName + price
        const withDetails = await Promise.all(
          rawItems.map(async (item) => {
            const resp = await fetch(
              `http://localhost:8080/api/main/products/${item.productId}`,
              { credentials: "include" }
            );
            if (!resp.ok) throw new Error("Failed to load product info");
            const prod = await resp.json();
            return {
              ...item,
              productName: prod.productName,
              price:       prod.price,
            };
          })
        );
        setItems(withDetails);
      })
      .catch(() => setError("Could not load your cart."))
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && items.length === 0;
  const total   = items.reduce(
    (sum, it) => sum + (it.price ?? 0) * (it.quantity ?? 0),
    0
  );

  return (
    <>
      {/* ← Add your fixed header here */}

      <div className={`cart-page ${isEmpty ? "empty" : "filled"}`}>
        {loading ? (
          <p className="center">Loading…</p>
        ) : error ? (
          <p className="center error">{error}</p>
        ) : isEmpty ? (
          <>
            <h2>Your cart is empty.</h2>
            <p className="subtext">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button onClick={() => navigate("/")}>Go to Products</button>
          </>
        ) : (
          <>
            <h2>Your Cart</h2>
            <div className="cart-content">
              <div className="cart-items">
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <div key={item.productId} className="cart-item">
                      <div>
                        <h4>{item.productName}</h4>
                        <p>
                          ${item.price.toFixed(2)} × {item.quantity} ={" "}
                          ${lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="cart-summary">
                <h3>Total: ${total.toFixed(2)}</h3>
                <button onClick={() => window.location.reload()}>
                  Refresh
                </button>
                <button onClick={() => navigate("/checkout")}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
