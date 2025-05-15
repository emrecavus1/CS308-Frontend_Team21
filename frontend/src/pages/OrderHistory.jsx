import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import "./OrderHistory.css";

export default function OrderHistory() {
  const navigate = useNavigate();

  const [tabId, setTabId] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const [activePage, setActivePage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [productPage, setProductPage] = useState(0);

  const [ready, setReady] = useState(false);

  const [activeOrders, setActiveOrders] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [error, setError] = useState("");
  const [productNames, setProductNames] = useState({});

  // Step 1: Resolve tabId, token, and userId securely
  useEffect(() => {
    const t = sessionStorage.getItem("tabId");

    // Abort if tabId is malformed or missing
    if (!t || t.includes(",")) {
      console.warn("Invalid tabId format or session corruption.");
      navigate("/login");
      return;
    }

    const tok = sessionStorage.getItem(`${t}-authToken`);
    const uid = sessionStorage.getItem(`${t}-userId`);

    if (!tok || !uid) {
      console.warn("Missing token or userId for tab:", t);
      navigate("/login");
      return;
    }

    setTabId(t);
    setToken(tok);
    setUserId(uid);
  }, [navigate]);

  // Step 2: Load user, orders, and recommendations
  useEffect(() => {
    if (!token || !userId) return;

    const headers = { Authorization: `Bearer ${token}` };

    const load = (url, setter, msg) =>
      fetch(url, { headers })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(setter)
        .catch(() => setError((e) => (e ? e + " " + msg : msg)));

    load(`http://localhost:8080/api/order/viewActiveOrders/${userId}`, setActiveOrders, "Could not load active orders.");
    load(`http://localhost:8080/api/order/viewPreviousOrders/${userId}`, setPreviousOrders, "Could not load previous orders.");

    fetch(`http://localhost:8080/api/order/previous-products/${userId}`, { headers })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setRecommended)
      .catch(() => setError((e) => (e ? e + " Could not load recommended products." : "Could not load recommended products.")));

      fetch(`http://localhost:8080/api/auth/user/${userId}`, { headers })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((userData) => {
        setUser(userData);
        setReady(true); // ✅ Set ready only after user is confirmed
      })
      .catch(() => {
        setError((e) => (e ? e + " Could not load user info." : "Could not load user info."));
        navigate("/login"); // fallback in case user fetch fails
      });
    
  }, [token, userId]);

  // Step 3: Load product names for display
  useEffect(() => {
    const allIds = new Set();
    [...activeOrders, ...previousOrders].forEach((o) =>
      o.productIds.forEach((pid) => allIds.add(pid))
    );

    allIds.forEach((pid) => {
      if (!productNames[pid]) {
        fetch(`http://localhost:8080/api/main/products/${pid}`)
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((prod) => {
            setProductNames((m) => ({ ...m, [pid]: prod.productName }));
          })
          .catch(() => { /* silent fail */ });
      }
    });
  }, [activeOrders, previousOrders, productNames]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}

    // Clear only current tab’s session data
    sessionStorage.removeItem(`${tabId}-authToken`);
    sessionStorage.removeItem(`${tabId}-userId`);
    sessionStorage.removeItem(`${tabId}-userName`);
    sessionStorage.removeItem(`${tabId}-userSurname`);
    sessionStorage.removeItem(`${tabId}-role`);
    sessionStorage.removeItem(`${tabId}-specificAddress`);
    sessionStorage.removeItem(`${tabId}-email`);

    window.location.href = "/login";
  };

  if (!ready) return <div style={{ paddingTop: "100px", textAlign: "center" }}>Loading...</div>;

  return (
    <>
      <Header />
      <div className="order-history-page">
        <div className="orders-content">
          <div className="orders-grid">
            {/* Active Orders */}
            <div className="section-wrapper">
              <h3>Active Orders</h3>
              {activeOrders.length === 0 ? (
                <p className="no-orders-message">No active orders.</p>
              ) : (
                <>
                  {activeOrders.slice(activePage, activePage + 1).map((order) => (
                    <div key={order.orderId} className="order-card">
                      <p><strong>Order #{order.orderId}</strong></p>
                      <p>Status: {order.status}</p>
                      {order.invoiceSentDate && (
                        <p>Date: {new Date(order.invoiceSentDate).toLocaleString()}</p>
                      )}
                      <ul>
                        {order.productIds.map((pid, i) => (
                          <li key={pid}>
                            {productNames[pid] || pid} × {order.quantities[i] || 1}
                          </li>
                        ))}
                      </ul>
                      {user && (
                        <p className="user-address">
                          <strong>Shipping Address:</strong> {user.specificAddress}
                        </p>
                      )}
                      <button
                        className={`cancel-order-button ${order.status !== "Processing" ? "disabled-button" : ""}`}
                        disabled={order.status !== "Processing"}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (order.status !== "Processing") return;

                          try {
                            const res = await fetch(
                              `http://localhost:8080/api/order/cancel/${order.orderId}?userId=${userId}`,
                              {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            if (res.ok) {
                              setActiveOrders((prev) =>
                                prev.filter((o) => o.orderId !== order.orderId)
                              );
                              setActivePage(0);
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
                  ))}
                  <div className="pagination-controls">
                    <button onClick={() => setActivePage((p) => p - 1)} disabled={activePage === 0}>
                      Previous
                    </button>
                    <button
                      onClick={() => setActivePage((p) => p + 1)}
                      disabled={activePage >= activeOrders.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Previous Orders */}
            <div className="section-wrapper">
              <h3>Previous Orders</h3>
              {previousOrders.length === 0 ? (
                <p className="no-orders-message">No past orders.</p>
              ) : (
                <>
                  {previousOrders.slice(previousPage, previousPage + 1).map((order) => (
                    <div key={order.orderId} className="order-card">
                      <p><strong>Order #{order.orderId}</strong></p>
                      <p>Status: {order.status}</p>
                      {order.invoiceSentDate && (
                        <p>Date: {new Date(order.invoiceSentDate).toLocaleString()}</p>
                      )}
                      <ul>
                        {order.productIds.map((pid, i) => (
                          <li key={pid}>
                            {productNames[pid] || pid} × {order.quantities[i] || 1}
                          </li>
                        ))}
                      </ul>
                      {user && (
                        <p className="user-address">
                          <strong>Shipping Address:</strong> {user.specificAddress}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="pagination-controls">
                    <button onClick={() => setPreviousPage((p) => p - 1)} disabled={previousPage === 0}>
                      Previous
                    </button>
                    <button
                      onClick={() => setPreviousPage((p) => p + 1)}
                      disabled={previousPage >= previousOrders.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recommended Products */}
          <div className="section-wrapper">
            <h3>Previously Purchased Products</h3>
            {recommended.length === 0 ? (
              <p className="no-orders-message">No products to recommend.</p>
            ) : (
              <>
                <div className="products-grid mini-grid">
                  {recommended
                    .slice(productPage * 3, productPage * 3 + 3)
                    .map((prod) => (
                      <ProductCard key={prod.productId} product={prod} />
                    ))}
                </div>
                <div className="pagination-controls">
                  <button onClick={() => setProductPage((p) => p - 1)} disabled={productPage === 0}>
                    Previous
                  </button>
                  <button
                    onClick={() => setProductPage((p) => p + 1)}
                    disabled={(productPage + 1) * 3 >= recommended.length}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
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
