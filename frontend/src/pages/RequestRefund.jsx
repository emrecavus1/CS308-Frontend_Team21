import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./RequestRefund.css"; // reuse existing styles

export default function RequestRefund() {
  const navigate = useNavigate();
  const tabId = sessionStorage.getItem("tabId");
  const token = sessionStorage.getItem(`${tabId}-authToken`);
  const userId = sessionStorage.getItem(`${tabId}-userId`);

  const [orders, setOrders] = useState([]);
  const [productInfo, setProductInfo] = useState({});
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

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
      params.append("productId", productId);
      params.append("quantity", quantity.toString());

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

  // Pagination logic
  const totalPages = orders.length;
  const currentOrder = orders[page - 1];

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
            <>
              <div key={currentOrder.orderId} className="refund-order-card">
              <p><strong>Order #{currentOrder.orderId}</strong> — Status: {currentOrder.status}</p>
              {currentOrder.invoiceSentDate && (
                <p>Date: {new Date(currentOrder.invoiceSentDate).toLocaleString()}</p>
              )}

                <ul>
                  {currentOrder.productIds.map((pid, i) => (
                    <li key={pid} style={{ marginBottom: "0.5rem" }}>
                      <span className="product-name">{productInfo[pid]?.productName || pid}</span>
                      {" × "}{currentOrder.quantities[i] || 1}
                      <button
                        className="refund-button"
                        onClick={() => handleRefund(currentOrder.orderId, pid, currentOrder.quantities[i] || 1)}
                      >
                        Request Refund
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pagination-controls">
                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
                  ← Prev
                </button>
                <span>Order {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
