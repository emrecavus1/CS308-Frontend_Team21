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
  const [invoiceUrl, setInvoiceUrl] = useState("");  // ← holds blob URL

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to checkout.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setInvoiceUrl("");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // 1) charge the card & create the order,
      //    response body is the orderId (plain-text)
      const res = await fetch(
        `http://localhost:8080/api/order/order` +
          `?cardNumber=${encodeURIComponent(cardNumber)}` +
          `&expiryDate=${encodeURIComponent(expiryDate)}` +
          `&cvv=${encodeURIComponent(cvv)}`,
        {
          method:      "PUT",
          credentials: "include",               // send CART_ID cookie
          headers: {
            "Authorization": `Bearer ${token}`, // send user JWT
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Payment failed (${res.status})`);
      }

      // grab the newly created orderId from the response
      const orderId = (await res.text()).trim();

      setSuccess("Payment successful! Here’s your invoice ↓");

      // 2) fetch the PDF from /api/invoices/{orderId}
        const pdfRes = await fetch(
           `http://localhost:8080/api/invoices/${encodeURIComponent(orderId)}`,  // simple GET
           {
                method: "GET",
                credentials: "include"
           }
          );
      if (!pdfRes.ok) {
        throw new Error("Could not fetch invoice PDF");
      }
      const blob = await pdfRes.blob();
      const blobUrl = URL.createObjectURL(blob);
      setInvoiceUrl(blobUrl);

      // 3) clear the cart cookie
      document.cookie = "CART_ID=;path=/;max-age=0";

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />

      <div className="checkout-page">
        <h2>Checkout</h2>
        {error &&   <p className="error">{error}</p>}
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
          // once we have an invoiceUrl, show it
          invoiceUrl && (
            <div className="invoice-preview">
              <iframe
                title="Your Invoice"
                src={invoiceUrl}
                width="100%" height="800px"
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
