// src/pages/AddRemoveCategory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./AddRemoveCategory.css";

export default function AddRemoveCategory() {
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/main/getCategories")
      .then(res => setCategories(res.data.categories))
      .catch(() => setMessage("Failed to load categories"));
  }, []);

  const handleAddCategory = async () => {
    try {
      await axios.post("http://localhost:8080/api/main/addCategory", { categoryName: newCategory });
      setMessage("Category added successfully");
      setNewCategory("");
      const updated = await axios.get("http://localhost:8080/api/main/getCategories");
      setCategories(updated.data.categories);
    } catch {
      setMessage("Error adding category");
    }
  };

  const handleRemoveCategory = async () => {
    if (!selectedCategoryId) return;
    try {
      await axios.delete(`http://localhost:8080/api/main/deleteCategory/${selectedCategoryId}`);
      setMessage("Category removed successfully");
      setSelectedCategoryId("");
      const updated = await axios.get("http://localhost:8080/api/main/getCategories");
      setCategories(updated.data.categories);
    } catch {
      setMessage("Error removing category");
    }
  };

  return (
    <>
      <Header />
      <div className="category-page">
        <h2>Manage Categories</h2>

        {message && <p className="feedback-message">{message}</p>}

        <div className="category-section">
          <label>Add New Category</label>
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <button className="action-button" onClick={handleAddCategory}>
            ➕ Add Category
          </button>
        </div>

        <div className="category-section">
          <label>Remove Category</label>
          <select
            value={selectedCategoryId}
            onChange={e => setSelectedCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
          <button className="action-button danger" onClick={handleRemoveCategory}>
            🗑️ Remove Category
          </button>
        </div>
      </div>
    </>
  );
}
