// src/pages/ProductManager.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./ProductManager.css";

export default function ProductManager() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <Header />
      <div className="pm-container">
        <h1 className="pm-title">Product Manager Dashboard</h1>
        <div className="pm-button-grid">
          <button onClick={() => handleNavigation("/")} className="pm-button">
            🛍️ Do Shopping
          </button>
          <button onClick={() => handleNavigation("/product-manager/add-remove-product")} className="pm-button">
            ➕🗑️ Add / Remove Product
          </button>
          <button onClick={() => handleNavigation("/product-manager/add-remove-category")} className="pm-button">
            🗂️🗑️ Add / Remove Category
          </button>
          <button onClick={() => handleNavigation("/product-manager/update-stock")} className="pm-button">
            📦 Update Stock
          </button>
          <button onClick={() => handleNavigation("/product-manager/orders")} className="pm-button">
            📑 Orders
          </button>
          <button onClick={() => handleNavigation("/product-manager/comments")} className="pm-button">
            💬 Comments
          </button>
        </div>
      </div>
    </>
  );
}
