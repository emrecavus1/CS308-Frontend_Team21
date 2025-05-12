import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import "./Results.css";

export default function Results() {
  const location = useLocation();
  const { startDate, endDate } = location.state || {};
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (!startDate || !endDate) {
      setError("Start and end dates are required.");
      return;
    }

    const fetchInvoices = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/invoices/date-range?startDate=${encodeURIComponent(
            startDate
          )}&endDate=${encodeURIComponent(endDate)}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch invoices.");
        const data = await res.json();
        setInvoices(data);
      } catch (err) {
        console.error(err);
        setError("Could not load invoices.");
      }
    };

    fetchInvoices();
  }, [startDate, endDate]);

  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const currentInvoices = invoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleDownload = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/invoices/${encodeURIComponent(orderId)}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to download invoice.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download invoice.");
    }
  };

  return (
    <>
      <Header />
      <div className="invoice-page">
        <h2>🧾 Invoice Results</h2>

        {error && <p className="error-message">{error}</p>}

        {invoices.length === 0 && !error && (
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            No invoices found in this range.
          </p>
        )}

        {invoices.length > 0 && (
          <>
            <div className="invoice-dropdown">
              <ul>
                {currentInvoices.map((inv) => (
                  <li key={inv.orderId}>
                    <strong>Order ID:</strong> {inv.orderId} <br />
                    <strong>User:</strong> {inv.userName} <br />
                    <strong>Date:</strong> {inv.invoiceSentDate} <br />
                    <button
                      className="download-button"
                      onClick={() => handleDownload(inv.orderId)}
                    >
                      Download PDF
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pagination-controls">
              <button onClick={handlePrev} disabled={currentPage === 1}>
                ← Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
