import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import Header from "../components/Header";

export default function OrdersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");  // ✅ For feedback

  // Fetch all users
  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/all-users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  // Fetch orders for selected user
  const fetchOrders = () => {
    if (selectedUserId) {
      axios.get(`http://localhost:8080/api/order/user/${selectedUserId}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error("Error fetching orders:", err));
    }
  };

  useEffect(() => {
    fetchOrders();
    setSelectedOrderId("");
    setOrderDetails([]);
    setStatusMessage("");
  }, [selectedUserId]);

  // Fetch order details for selected order
  const fetchOrderDetails = () => {
    if (selectedOrderId) {
      axios.get("http://localhost:8080/api/manager/delivery-details", {
        params: { orderId: selectedOrderId }
      })
        .then(res => setOrderDetails(res.data))
        .catch(err => console.error("Error fetching delivery info:", err));
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    setStatusMessage("");
  }, [selectedOrderId]);

  // Action handlers
  const handleMarkStatus = async (type) => {
    const url = `http://localhost:8080/api/order/${type}/${selectedOrderId}`;
    try {
      await axios.put(url);
      setStatusMessage(`✅ Order marked as ${type === "markShipped" ? "shipped" : "in transit"}`);
      fetchOrders();       // Refresh order list
      fetchOrderDetails(); // Refresh detail view
    } catch (err) {
      console.error(`Error marking order as ${type}:`, err);
      setStatusMessage(`❌ Failed to mark as ${type}`);
    }
  };

  const handleDownloadInvoice = () => {
    if (!selectedOrderId) return;
    window.open(`http://localhost:8080/api/invoices/${selectedOrderId}`, "_blank");
  };

  return (
    <>
      <Header />
      <div className="orders-container">
        <h2>View Orders by User</h2>

        <select className="order-dropdown" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
          <option value="">Select a user</option>
          {users.map(u => (
            <option key={u.userId} value={u.userId}>{u.name} {u.surname}</option>
          ))}
        </select>



        {selectedUserId && orders.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "1rem", color: "gray" }}>
            No active orders for this user.
          </p>
        )}

        {orders.length > 0 && (
          <>
            <select
              className="order-dropdown"
              value={selectedOrderId}
              onChange={e => setSelectedOrderId(e.target.value)}
              style={{ marginTop: "10px" }}
            >
              <option value="">Select an order</option>
              {orders.map(o => (
                <option key={o.orderId} value={o.orderId}>
                  {o.orderId} — {o.status} {o.shipped ? "✓" : "✗"}
                </option>
              ))}
            </select>

            {selectedUserId && (
          <p style={{ textAlign: "center", margin: "0.5rem 0", fontStyle: "italic", color: "#333" }}>
            User ID: <code>{selectedUserId}</code>
          </p>
        )}

            {selectedOrderId && orders.find(o => o.orderId === selectedOrderId)?.status.toLowerCase() !== "delivered" && (
              <div className="order-action-buttons">
                <button onClick={() => handleMarkStatus("markInTransit")}>🚚 Mark as In Transit</button>
                <button onClick={() => handleMarkStatus("markShipped")}>📦 Mark as Shipped</button>
              </div>
            )}
          </>
        )}

        {statusMessage && <div className="status-message">{statusMessage}</div>}

        {orderDetails.length > 0 && (
          <>
            <button onClick={handleDownloadInvoice} style={{ marginTop: "10px" }}>
              📄 Download Invoice
            </button>

            <table className="orders-table">
            <thead>
              <tr>
                <th>Product ID</th> {/* new */}
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Delivery Address</th>
                <th>Delivered</th>
              </tr>
            </thead>

            <tbody>
              {orderDetails.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.productId || "N/A"}</td> {/* product ID field */}
                  <td>{entry.productName}</td>
                  <td>{entry.quantity}</td>
                  <td>${entry.totalPrice?.toFixed(2)}</td>
                  <td>{entry.deliveryAddress}</td>
                  <td style={{ textAlign: "center" }}>
                    {entry.delivered ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>


            </table>
          </>
        )}
      </div>
    </>
  );
}