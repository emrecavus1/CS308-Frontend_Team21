// src/pages/RemoveProduct.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./RemoveProduct.css";

export default function RemoveProduct() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/main/getCategories")
      .then(res => setCategories(res.data.categories))
      .catch(() => setMessage("Failed to load categories"));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios.get(`http://localhost:8080/api/main/category/${selectedCategory}/getProductsByCategory`)
        .then(res => setProducts(res.data.products))
        .catch(() => setProducts([]));
    }
  }, [selectedCategory]);

  const handleRemove = async () => {
    if (!selectedProductId) return;
    try {
      await axios.delete(`http://localhost:8080/api/main/deleteProduct/${selectedProductId}`);
      setMessage("Product removed successfully.");
      setSelectedProductId("");
    } catch (err) {
      setMessage("Error removing product.");
    }
  };

  return (
    <>
      <Header />
      <div className="rp-container">
        <h1 className="rp-title">Remove Product</h1>
        {message && <p className="rp-message">{message}</p>}
  
        <div className="rp-form">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="rp-input"
          >
            <option value="">Choose Category</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
  
          <select
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            className="rp-input"
          >
            <option value="">Choose Product</option>
            {products.map(p => (
              <option key={p.productId} value={p.productId}>
                {p.productName}
              </option>
            ))}
          </select>
  
          <button className="rp-button danger" onClick={handleRemove}>
            🗑️ Remove Product
          </button>
        </div>
      </div>
    </>
  );
  
}