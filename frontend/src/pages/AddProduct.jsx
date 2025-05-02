// src/pages/AddProduct.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./AddProduct.css";

export default function AddProduct() {
  const [form, setForm] = useState({
    productName: "",
    productInfo: "",
    stockCount: 0,
    serialNumber: "",
    warrantyStatus: "",
    distributorInfo: ""
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/main/getCategories")
      .then(res => setCategories(res.data.categories))
      .catch(() => setMessage("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:8080/api/main/addProduct?categoryName=${selectedCategory}`, form);
      setMessage("Product added successfully.");
      setForm({
        productName: "",
        productInfo: "",
        stockCount: 0,
        serialNumber: "",
        warrantyStatus: "",
        distributorInfo: ""
      });
      setSelectedCategory("");
    } catch (err) {
      setMessage(err.response?.data || "Error adding product.");
    }
  };

  return (
    <>
      <Header />
      <div className="ap-container">
        <h1 className="ap-title">Add Product</h1>
        {message && <p className="ap-message">{message}</p>}

        <div className="ap-form">
          {Object.entries(form).map(([key, val]) => (
            <input
              key={key}
              name={key}
              placeholder={key.replace(/([A-Z])/g, ' $1')}
              value={val}
              onChange={handleChange}
              className="ap-input"
            />
          ))}

          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="ap-input">
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
            ))}
          </select>

          <button className="ap-button" onClick={handleSubmit}>➕ Add Product</button>
        </div>
      </div>
    </>
  );
}