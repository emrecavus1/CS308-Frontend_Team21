// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate }                from "react-router-dom";
import Header                         from "../components/Header";
import "./OrderHistory.css";

export default function OrderHistory() {
  const navigate    = useNavigate();
  const token       = localStorage.getItem("authToken");
  const userId      = localStorage.getItem("userId");
  const userName    = localStorage.getItem("userName")    || ""; 
  const userSurname = localStorage.getItem("userSurname") || "";

  const [activeOrders, setActiveOrders]     = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [error, setError]                   = useState("");

  // our little in‐memory cache of productId→productName
  const [productNames, setProductNames]     = useState({});

  // Redirect if no token/userId, otherwise load orders
  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    // helper to load orders
    const load = (url, setter, errMsg) =>
      fetch(url, { headers })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(setter)
        .catch(() => setError(e => e ? e + " " + errMsg : errMsg));

    load(
      `http://localhost:8080/api/order/viewActiveOrders/${userId}`,
      setActiveOrders,
      "Could not load active orders."
    );
    load(
      `http://localhost:8080/api/order/viewPreviousOrders/${userId}`,
      setPreviousOrders,
      "Could not load previous orders."
    );
  }, [token, userId, navigate]);

  // Whenever either set of orders changes, fetch any productIds we don't yet know
  useEffect(() => {
    const allIds = new Set();
    activeOrders.forEach(o => o.productIds.forEach(id => allIds.add(id)));
    previousOrders.forEach(o => o.productIds.forEach(id => allIds.add(id)));

    allIds.forEach(pid => {
      if (!productNames[pid]) {
        fetch(`http://localhost:8080/api/main/products/${pid}`)
          .then(res => res.ok ? res.json() : Promise.reject())
          .then(data => {
            setProductNames(prev => ({ ...prev, [pid]: data.productName }));
          })
          .catch(() => {
            // silently fail, we'll just show the raw ID
          });
      }
    });
  }, [activeOrders, previousOrders, productNames]);

  if (!token) return null; // waiting on redirect

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.warn("Logout failed:", e);
    }
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="order-history-page">
      <Header />

      <div className="profile-bar">
        <span>Hello, {userName} {userSurname}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="orders-content">
        {error && <p className="error">{error}</p>}

        <section>
          <h3>Active Orders</h3>
          {activeOrders.length === 0 ? (
            <p>No active orders.</p>
          ) : (
            activeOrders.map(order => (
              <div key={order.orderId} className="order-card">
                <p><strong>Order #{order.orderId}</strong></p>
                <p>Status: {order.status}</p>
                <ul>
                  {order.productIds.map((pid, idx) => (
                    <li key={pid}>
                      {productNames[pid] || pid} × {order.quantities[idx] || 1}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>

        <section style={{ marginTop: "2rem" }}>
          <h3>Previous Orders</h3>
          {previousOrders.length === 0 ? (
            <p>No past orders.</p>
          ) : (
            previousOrders.map(order => (
              <div key={order.orderId} className="order-card">
                <p><strong>Order #{order.orderId}</strong></p>
                <p>Status: {order.status}</p>
                <ul>
                  {order.productIds.map((pid, idx) => (
                    <li key={pid}>
                      {productNames[pid] || pid} × {order.quantities[idx] || 1}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
