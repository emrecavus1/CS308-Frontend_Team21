// src/pages/AddRemoveProduct.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./AddRemoveProduct.css";

export default function AddRemoveProduct() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="arp-container">
        <h1 className="arp-title">Manage Products</h1>

        <div className="arp-button-grid">
          <button
            className="arp-button"
            onClick={() => navigate("/product-manager/add-product")}
          >
            ➕ Add Product
          </button>

          <button
            className="arp-button danger"
            onClick={() => navigate("/product-manager/remove-product")}
          >
            🗑️ Remove Product
          </button>
        </div>
      </div>
    </>
  );
}
