// src/pages/UpdatePrice.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./UpdatePrice.css";

export default function UpdatePrice() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [message, setMessage] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);

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
  
  useEffect(() => {
    if (selectedProductId) {
      axios.get(`http://localhost:8080/api/main/products/${selectedProductId}`)
        .then(res => setCurrentPrice(res.data.price))
        .catch(() => setCurrentPrice(null));
    } else {
      setCurrentPrice(null);
    }
  }, [selectedProductId]);
  

  const handleUpdate = async () => {
    if (!selectedProductId || newPrice === "") return;
    try {
      await axios.put(`http://localhost:8080/api/main/updatePrice/${selectedProductId}/${newPrice}`);
      setMessage("Price updated successfully.");
      setNewPrice("");
    } catch (err) {
      setMessage(err.response?.data || "Error updating price.");
    }
  };

  return (
    <>
      <Header />
      <div className="up-container">
        <h1 className="up-title">Update Product Price</h1>
        {message && <p className="up-message">{message}</p>}

        <div className="up-form">
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="up-input">
            <option value="">Choose Category</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>

          <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="up-input">
            <option value="">Choose Product</option>
            {products.map(p => (
              <option key={p.productId} value={p.productId}>{p.productName}</option>
            ))}
          </select>

          {currentPrice !== null && (<p className="up-current-price">Current Price: ${currentPrice.toFixed(2)}</p>)}

          <input
            type="number"
            placeholder="Enter New Price"
            value={newPrice}
            onChange={e => setNewPrice(e.target.value)}
            className="up-input"
          />

          <button className="up-button" onClick={handleUpdate}>💰 Update Price</button>
        </div>
      </div>
    </>
  );
}
