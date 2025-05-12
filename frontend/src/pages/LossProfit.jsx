import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Chart from "chart.js/auto";
import "./LossProfit.css";

export default function LossProfit() {
  const location = useLocation();
  const { startDate, endDate } = location.state || {};

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showChart, setShowChart] = useState(false); // ✅ new state
  const [currentPage, setCurrentPage] = useState(1);
  const [productNames, setProductNames] = useState({});

  const itemsPerPage = 5;

  useEffect(() => {
    if (!startDate || !endDate) {
      setError("Start and end dates are required.");
      return;
    }

    fetch(
      `http://localhost:8080/api/order/analytics/revenue?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`,
      {
        credentials: "include",
      }
    )
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch data.")
      )
      .then(async (res) => {
        const nameMap = {};
        for (let item of res.breakdown) {
          try {
            const prodRes = await fetch(
              `http://localhost:8080/api/main/products/${item.productId}`
            );
            if (prodRes.ok) {
              const prodData = await prodRes.json();
              nameMap[item.productId] = prodData.productName;
            }
          } catch (e) {
            nameMap[item.productId] = item.productId;
          }
        }
        setProductNames(nameMap);
        setData(res);
      })
      .catch((err) => setError(err.toString()));
  }, [startDate, endDate]);

  useEffect(() => {
    if (!showChart || !data) return;

    const ctx = document.getElementById("profitChart");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.breakdown.map((item) => productNames[item.productId] || item.productId),
        datasets: [
          {
            label: "Profit ($)",
            data: data.breakdown.map((item) => item.profit),
            backgroundColor: data.breakdown.map((item) =>
              item.profit >= 0 ? "rgba(0, 128, 0, 0.6)" : "rgba(255, 0, 0, 0.6)"
            ),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Profit per Product",
          },
        },
      },
    });

    return () => chart.destroy();
  }, [showChart, data, productNames]);

  const totalPages = data ? Math.ceil(data.breakdown.length / itemsPerPage) : 1;
  const currentItems = data
    ? data.breakdown.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <>
      <Header />
      <div className="report-page">
        <h2>📊 Revenue & Profit Analysis</h2>
        <p className="date-range-summary">
          From <strong>{startDate}</strong> to <strong>{endDate}</strong>
        </p>

        {error && <p className="error-message">{error}</p>}

        {data && (
          <>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Revenue</h3>
                <p>${data.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="summary-card">
                <h3>Total Cost</h3>
                <p>${data.totalCost.toFixed(2)}</p>
              </div>
              <div className="summary-card">
                <h3>{data.profit >= 0 ? "Profit" : "Loss"}</h3>
                <p style={{ color: data.profit >= 0 ? "green" : "red" }}>
                  ${data.profit.toFixed(2)}
                </p>
              </div>
            </div>

            {/* ✅ New: button row */}
            <div className="button-row">
                <button
                    className="action-btn"
                    onClick={() => {
                    setShowBreakdown((prev) => {
                        if (!prev) setShowChart(false); // Close chart when opening breakdown
                        return !prev;
                    });
                    }}
                >
                    {showBreakdown ? "▲ Hide Breakdown" : "▼ Show Breakdown by Product"}
                </button>

                <button
                    className="action-btn"
                    onClick={() => {
                    setShowChart((prev) => {
                        if (!prev) setShowBreakdown(false); // Close breakdown when opening chart
                        return !prev;
                    });
                    }}
                >
                    {showChart ? "▲ Hide Chart" : "📊 View Chart"}
                </button>
            </div>

            {showBreakdown && (
              <div className="dropdown-container open">
                <h3>Breakdown by Product</h3>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Revenue</th>
                      <th>Cost</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, i) => (
                      <tr key={i}>
                        <td>{productNames[item.productId] || item.productId}</td>
                        <td>{item.quantity}</td>
                        <td>${item.revenue.toFixed(2)}</td>
                        <td>${item.cost.toFixed(2)}</td>
                        <td style={{ color: item.profit >= 0 ? "green" : "red" }}>
                          ${item.profit.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination-controls">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ← Prev
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {showChart && (
              <div className="chart-container">
                <canvas id="profitChart" height="250" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
