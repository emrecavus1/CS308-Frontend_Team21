// src/pages/RequestRefund.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./RequestRefund.css"; // reuse existing styles

export default function RequestRefund() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const [orders, setOrders] = useState([]);
  const [productInfo, setProductInfo] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:8080/api/order/viewPreviousOrders/${userId}?refundable=true`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setOrders)
      .catch(() => setMessage("Failed to fetch refundable orders."));
  }, [token, userId, navigate]);

  // Fetch product info lazily
  useEffect(() => {
    const allIds = new Set();
    orders.forEach(order =>
      order.productIds.forEach(pid => {
        if (!productInfo[pid]) allIds.add(pid);
      })
    );

    allIds.forEach(pid => {
      fetch(`http://localhost:8080/api/main/products/${pid}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(prod => {
          setProductInfo(prev => ({ ...prev, [pid]: prod }));
        })
        .catch(() => {});
    });
  }, [orders, productInfo]);

  const handleRefund = async (orderId, productId, quantity) => {
    try {
      const params = new URLSearchParams();
      params.append("userId", userId);
      params.append("productId", productId);     // singular!
      params.append("quantity", quantity.toString()); // singular!
  
      const res = await fetch(`http://localhost:8080/api/order/requestRefund/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: params,
      });
  
      if (res.ok) {
        setMessage(`✅ Refund requested for ${productInfo[productId]?.productName || productId}.`);
      } else {
        const errText = await res.text();
        setMessage("❌ Refund request failed: " + errText);
      }
    } catch (err) {
      setMessage("⚠️ Network error while requesting refund.");
    }
  };
  

  return (
    <>
      <Header />
      <div className="refund-page">
        <div className="orders-content">
          <h2>Request a Refund</h2>
          {message && <p style={{ marginBottom: "1rem", color: "#2d3748" }}>{message}</p>}

          {orders.length === 0 ? (
            <p className="no-orders-message">No refundable orders available.</p>
          ) : (
            orders.map(order => (
              <div key={order.orderId} className="refund-order-card">
                <p><strong>Order #{order.orderId}</strong> — Status: {order.status}</p>
                <ul>
                  {order.productIds.map((pid, i) => (
                    <li key={pid} style={{ marginBottom: "0.5rem" }}>
                      <span className="product-name">{productInfo[pid]?.productName || pid}</span>
                      {" × "}{order.quantities[i] || 1}
                      <button
                        className="refund-button"
                        onClick={() => handleRefund(order.orderId, pid, order.quantities[i] || 1)}
                      >
                        Request Refund
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
