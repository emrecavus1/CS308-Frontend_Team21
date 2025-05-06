// src/pages/SetDiscount.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./SetDiscount.css";

export default function SetDiscount() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [discount, setDiscount] = useState("");
  const [notify, setNotify] = useState(true); // default to notifying users
  const [message, setMessage] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);

  // Load categories on mount
  useEffect(() => {
    axios.get("http://localhost:8080/api/main/getCategories")
      .then(res => setCategories(res.data.categories))
      .catch(() => setMessage("❌ Failed to load categories."));
  }, []);

  // Load products when a category is selected
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

  // Handle discount submission
  const handleSetDiscount = async () => {
    if (!selectedProductId || !discount) {
      setMessage("⚠️ Please select a product and enter a discount.");
      return;
    }

    try {
      if (notify) {
        const res = await axios.post("http://localhost:8080/api/discounts/set", null, {
          params: { productId: selectedProductId, discountPercentage: discount },
          withCredentials: true 
        });
        setMessage(`✅ Discount set and ${res.data.notifiedUsers} users notified.`);
      } else {
        await axios.post("http://localhost:8080/api/discounts/set-silent", null, {
          params: { productId: selectedProductId, discountPercentage: discount },
          withCredentials: true 
        });
        setMessage("✅ Discount set silently.");
      }

      // Reset form
      setDiscount("");
      setSelectedProductId("");
      setSelectedCategory("");
    } catch (err) {
      setMessage("❌ Failed to set discount.");
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="discount-container">
        <h1 className="discount-title">Set Discount for a Product</h1>
        {message && <p className="discount-message">{message}</p>}

        <div className="discount-form">
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="discount-input">
            <option value="">Choose Category</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>

          <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="discount-input">
            <option value="">Choose Product</option>
            {products.map(p => (
              <option key={p.productId} value={p.productId}>{p.productName}</option>
            ))}
          </select>

          {currentPrice !== null && (<p className="up-current-price">Current Price: ${currentPrice.toFixed(2)}</p>)}

          <input
            type="number"
            placeholder="Discount %"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            className="discount-input"
          />

          <label className="discount-toggle">
            <input
              type="checkbox"
              checked={notify}
              onChange={() => setNotify(prev => !prev)}
            />
            Notify users in wishlist
          </label>

          <button className="discount-button" onClick={handleSetDiscount}>🎯 Apply Discount</button>
        </div>
      </div>
    </>
  );
}
