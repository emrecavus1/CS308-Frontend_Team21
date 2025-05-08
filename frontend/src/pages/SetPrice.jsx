// src/pages/SetPrice.jsx
import React, { useEffect, useState } from "react";
import "./SetPrice.css";
import Header from "../components/Header";

export default function SetPricePage() {
  const [products, setProducts] = useState([]);
  const [newPrices, setNewPrices] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/main/products/new")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setMessage("Failed to load new products."));
  }, []);

  const handlePriceChange = (productId, value) => {
    setNewPrices({ ...newPrices, [productId]: value });
  };

  const handleSetPrice = async (productId) => {
    const price = newPrices[productId];
    if (!price || isNaN(price) || price <= 0) {
      setMessage("Please enter a valid price.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/main/setPrice/${productId}/${price}`,
        { method: "PUT" }
      );
      if (res.ok) {
        setMessage("✅ Price set successfully.");
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
      } else {
        setMessage("❌ Failed to set price.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Error occurred while setting price.");
    }
  };

  return (
    <div className="set-price-page">
      <Header />
      <h1>🛠️ Set Prices for New Products</h1>
      {message && <p className="status-message">{message}</p>}

      {products.length === 0 ? (
        <p>No new products requiring price setup.</p>
      ) : (
        <table className="price-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Current Price</th>
              <th>Set New Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.productId}>
                <td>{p.productName}</td>
                <td>${p.price?.toFixed(2) || 0}</td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrices[p.productId] || ""}
                    onChange={(e) =>
                      handlePriceChange(p.productId, e.target.value)
                    }
                    placeholder="Enter price"
                  />
                </td>
                <td>
                  <button onClick={() => handleSetPrice(p.productId)}>
                    Set Price
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
