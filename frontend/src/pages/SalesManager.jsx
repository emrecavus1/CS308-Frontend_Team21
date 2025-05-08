// src/pages/SalesManager.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./SalesManager.css"; // <-- separate CSS for sales manager

export default function SalesManager() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <Header />
      <div className="sm-container">
        <h1 className="sm-title">Sales Manager Dashboard</h1>
        <div className="sm-button-grid">
          <button onClick={() => handleNavigation("/")} className="sm-button">
            🛍️ Do Shopping
          </button>
          <button onClick={() => handleNavigation("/sales-manager/update-price")} className="sm-button">
             🛠️ Update Price
          </button>

          <button onClick={() => handleNavigation("/sales-manager/set-price")} className="sm-button">
            💰 Set Price
          </button>
          <button onClick={() => handleNavigation("/sales-manager/set-discount")} className="sm-button">
            🔻 Set Discount
          </button>
          <button onClick={() => handleNavigation("/sales-manager/view-invoices")} className="sm-button">
            🧾 View Invoices
          </button>
          <button onClick={() => handleNavigation("/sales-manager/financial-report")} className="sm-button">
            📊 Financial Situation
          </button>

          <button onClick={() => handleNavigation("/sales-manager/refund-requests")} className="sm-button">
            💸 Refund Requests
          </button>
        </div>
      </div>
    </>
  );
}
