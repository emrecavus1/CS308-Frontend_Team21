// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate }          from "react-router-dom";
import Header                   from "../components/Header";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv]               = useState("");
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");

  // grab your auth token however you stored it
  const tabId = sessionStorage.getItem("tabId");
  const token = sessionStorage.getItem(`${tabId}-authToken`);

  // 1) if there's no token on mount, show a login prompt
  useEffect(() => {
    if (!token) {
      setError("You must be logged in to checkout.");
    }
  }, [token]);

  // 2) If we have no token, just render the message
  if (!token) {
    return (
      <>
        <Header />
        <div className="checkout-page">
          <h2>Checkout</h2>
          <p className="error">You must be logged in to checkout.</p>
        </div>
      </>
    );
  }

  // 3) Otherwise render the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setInvoiceUrl("");
  
    try {
      const res = await fetch(
        `http://localhost:8080/api/order/order` +
          `?tabId=${encodeURIComponent(tabId)}` +
          `&cardNumber=${encodeURIComponent(cardNumber)}` +
          `&expiryDate=${encodeURIComponent(expiryDate)}` +
          `&cvv=${encodeURIComponent(cvv)}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Payment failed (${res.status})`);
      }
  
      const orderId = (await res.text()).trim();
      setSuccess("Payment successful! Here’s your invoice ↓");
  
      const pdfRes = await fetch(
        `http://localhost:8080/api/invoices/${encodeURIComponent(orderId)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
  
      if (!pdfRes.ok) {
        throw new Error("Could not fetch invoice PDF");
      }
  
      const blob = await pdfRes.blob();
      setInvoiceUrl(URL.createObjectURL(blob));
  
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError("You must be logged in to checkout.");
      } else {
        setError(err.message);
      }
    }
  };
  

  return (
    <>
      <Header />

      <div className="checkout-page">
        <h2>Checkout</h2>
        {error   && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {!success ? (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>
              Card Number
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </label>

            <label>
              Expiry Date (MM/YY)
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </label>

            <label>
              CVV
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength={4}
                required
              />
            </label>

            <button type="submit">Pay Now</button>
          </form>
        ) : (
          invoiceUrl && (
            <div className="invoice-preview">
              <iframe
                title="Your Invoice"
                src={invoiceUrl}
                width="100%"
                height="800px"
                style={{ border: "none" }}
              />
              <p>
                <a href={invoiceUrl} download={`invoice-${Date.now()}.pdf`}>
                  Download PDF
                </a>
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}
