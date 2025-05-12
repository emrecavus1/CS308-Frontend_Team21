// src/pages/Invoices.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Invoices.css";

export default function Invoices() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    navigate("/sales-manager/invoices", {
      state: { startDate, endDate },
    });
  };

  return (
    <>
      <Header />
      <div className="invoice-page">
        <h2>📄 Filter Invoices by Date Range</h2>

        <div className="date-range-form">
          <label>
            Start Date:
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>

          <label>
            End Date:
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>

          <button onClick={handleSearch}>Search</button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
}