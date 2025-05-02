// src/pages/UpdateStock.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./UpdateStock.css";

export default function UpdateStock() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [newStock, setNewStock] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/main/getCategories")
      .then(res => setCategories(res.data.categories))
      .catch(() => setMessage("Failed to load categories"));
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      axios.get(`http://localhost:8080/api/main/category/${selectedCategoryId}/getProductsByCategory`)
        .then(res => setProducts(res.data.products))
        .catch(() => setMessage("Failed to load products"));
    } else {
      setProducts([]);
      setSelectedProductId("");
    }
  }, [selectedCategoryId]);

  const handleUpdateStock = async () => {
    if (!selectedProductId || !newStock) return;
    try {
      await axios.put(`http://localhost:8080/api/main/updateStock/${selectedProductId}/${newStock}`);
      setMessage("Stock updated successfully");
      setNewStock("");
    } catch {
      setMessage("Error updating stock");
    }
  };

  return (
    <>
      <Header />
      <div className="us-container">
        <h2 className="us-title">Update Product Stock</h2>
        {message && <p className="us-message">{message}</p>}

        <div className="us-section">
          <label>Select Category</label>
          <select
            className="us-select"
            value={selectedCategoryId}
            onChange={e => setSelectedCategoryId(e.target.value)}
          >
            <option value="">-- Choose Category --</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="us-section">
          <label>Select Product</label>
          <select
            className="us-select"
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            disabled={!products.length}
          >
            <option value="">-- Choose Product --</option>
            {products.map(p => (
              <option key={p.productId} value={p.productId}>
                {p.productName}
              </option>
            ))}
          </select>
        </div>

        <div className="us-section">
          <label>New Stock Value</label>
          <input
            type="number"
            className="us-input"
            value={newStock}
            onChange={e => setNewStock(e.target.value)}
            min="0"
          />
          <button onClick={handleUpdateStock} className="us-button">
            📦 Update Stock
          </button>
        </div>
      </div>
    </>
  );
}
