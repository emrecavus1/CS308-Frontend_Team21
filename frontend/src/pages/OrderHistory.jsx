// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import "./OrderHistory.css";


export default function OrderHistory() {
 const navigate = useNavigate();
 const tabId = sessionStorage.getItem("tabId");
 const token = sessionStorage.getItem(`${tabId}-authToken`);
 const userId = sessionStorage.getItem(`${tabId}-userId`);


 const [activeOrders, setActiveOrders] = useState([]);
 const [previousOrders, setPreviousOrders] = useState([]);
 const [recommended, setRecommended] = useState([]);
 const [error, setError] = useState("");
 const [productNames, setProductNames] = useState({});


 useEffect(() => {
  // Scroll the page container into view on mount
  const container = document.querySelector(".order-history-page");
  if (container) {
    container.scrollIntoView({ behavior: "auto", block: "start" });
  }
}, []);


 useEffect(() => {
   if (!token || !userId) {
     navigate("/login");
     return;
   }
   const headers = { Authorization: `Bearer ${token}` };


   const load = (url, setter, msg) =>
     fetch(url, { headers })
       .then(r => r.ok ? r.json() : Promise.reject())
       .then(setter)
       .catch(() => setError(e => e ? e + " " + msg : msg));


   load(`http://localhost:8080/api/order/viewActiveOrders/${userId}`, setActiveOrders, "Could not load active orders.");
   load(`http://localhost:8080/api/order/viewPreviousOrders/${userId}`, setPreviousOrders, "Could not load previous orders.");


   fetch(`http://localhost:8080/api/order/previous-products/${userId}`, { headers })
     .then(r => r.ok ? r.json() : Promise.reject())
     .then(setRecommended)
     .catch(() => setError(e => e ? e + " Could not load recommended products." : "Could not load recommended products."));
 }, [token, userId, navigate]);


 useEffect(() => {
   const allIds = new Set();
   [...activeOrders, ...previousOrders].forEach(o => o.productIds.forEach(pid => allIds.add(pid)));


   allIds.forEach(pid => {
     if (!productNames[pid]) {
       fetch(`http://localhost:8080/api/main/products/${pid}`)
         .then(r => r.ok ? r.json() : Promise.reject())
         .then(prod => {
           setProductNames(m => ({ ...m, [pid]: prod.productName }));
         })
         .catch(() => {/* silent failure */});
     }
   });
 }, [activeOrders, previousOrders, productNames]);


 if (!token) return null;


 const handleLogout = async () => {
  const tabId = sessionStorage.getItem("tabId");
  try {
    await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(`${tabId}-authToken`)}`,
      },
    });
  } catch {}

  // Only clear tab-specific session values
  sessionStorage.removeItem(`${tabId}-authToken`);
  sessionStorage.removeItem(`${tabId}-userId`);
  sessionStorage.removeItem(`${tabId}-userName`);
  sessionStorage.removeItem(`${tabId}-userSurname`);
  sessionStorage.removeItem(`${tabId}-role`);
  sessionStorage.removeItem(`${tabId}-specificAddress`);
  sessionStorage.removeItem(`${tabId}-email`);

  window.location.href = "/login";
};


return (
  <>
    <Header />
    <div className="order-history-page">
      <div className="orders-content">
        {/* Grid for Active + Previous Orders */}
        <div className="orders-grid">
          {/* Active Orders */}
          <div className="section-wrapper">
            <h3>Active Orders</h3>
            {activeOrders.length === 0 ? (
              <p className="no-orders-message">No active orders.</p>
            ) : (
              activeOrders.map(order => (
                <div key={order.orderId} className="order-card">
                  <p><strong>Order #{order.orderId}</strong></p>
                  <p>Status: {order.status}</p>
                  <ul>
                    {order.productIds.map((pid, i) => (
                      <li key={pid}>
                        {productNames[pid] || pid} × {order.quantities[i] || 1}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="cancel-order-button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const res = await fetch(`http://localhost:8080/api/order/cancel/${order.orderId}?userId=${userId}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        if (res.ok) {
                          setActiveOrders(prev => prev.filter(o => o.orderId !== order.orderId));
                        } else {
                          console.error("Failed to cancel order.");
                        }
                      } catch (err) {
                        console.error("Cancel order error:", err);
                      }
                    }}
                  >
                    Cancel Order
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Previous Orders */}
          <div className="section-wrapper">
            <h3>Previous Orders</h3>
            {previousOrders.length === 0 ? (
              <p className="no-orders-message">No past orders.</p>
            ) : (
              previousOrders.map(order => (
                <div key={order.orderId} className="order-card">
                  <p><strong>Order #{order.orderId}</strong></p>
                  <p>Status: {order.status}</p>
                  <ul>
                    {order.productIds.map((pid, i) => (
                      <li key={pid}>
                        {productNames[pid] || pid} × {order.quantities[i] || 1}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Previously Purchased Products (Compact View) */}
        <div className="section-wrapper">
          <h3>Previously Purchased Products</h3>
          {recommended.length === 0 ? (
            <p className="no-orders-message">No products to recommend.</p>
          ) : (
            <div className="products-grid mini-grid">
              {recommended.map(prod => (
                <ProductCard key={prod.productId} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="logout-button-container">
        <button className="refund-button" onClick={() => navigate("/refunds")}>
          Request Refunds
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  </>
);

}
