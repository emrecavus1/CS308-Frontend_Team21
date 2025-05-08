import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./Refunds.css";

export default function Refund() {
  const [requests, setRequests] = useState([]);
  const [productNames, setProductNames] = useState({});
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/order/refundRequests/active")
      .then(async (res) => {
        const data = res.data;
        setRequests(data);

        // === Fetch Product Names ===
        const allProductIds = [...new Set(data.flatMap(req => req.items.map(item => item.productId)))];
        const nameMap = {};
        await Promise.all(allProductIds.map(async id => {
          try {
            const res = await axios.get(`http://localhost:8080/api/main/products/${id}`);
            nameMap[id] = res.data.productName;
          } catch {
            nameMap[id] = "Unknown Product";
          }
        }));
        setProductNames(nameMap);

        // === Fetch User Names ===
        const allUserIds = [...new Set(data.map(req => req.userId))];
        const userMap = {};
        await Promise.all(allUserIds.map(async id => {
          try {
            const res = await axios.get(`http://localhost:8080/api/auth/user/${id}`);
            const user = res.data;
            userMap[id] = `${user.name} ${user.surname}`;
          } catch {
            userMap[id] = "Unknown User";
          }
        }));
        setUserNames(userMap);

        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load refund requests.");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/order/refund/approve/${id}`);
      setRequests(prev => prev.filter(r => r.requestId !== id));
      setMessage("Refund approved ✅");
    } catch {
      setMessage("Failed to approve refund ❌");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/order/refund/reject/${id}`);
      setRequests(prev => prev.filter(r => r.requestId !== id));
      setMessage("Refund rejected ❌");
    } catch {
      setMessage("Failed to reject refund ❌");
    }
  };

  return (
    <>
      <Header />
      <div className="refund-container">
        <h1>📦 Pending Refund Requests</h1>
        {message && <div className="refund-message">{message}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No active refund requests 🎉</p>
        ) : (
          <div className="refund-grid">
            {requests.map(req => (
              <div className="refund-card" key={req.requestId}>
                <p><strong>Order ID:</strong> {req.orderId}</p>
                <p><strong>User:</strong> {userNames[req.userId] || req.userId}</p>
                <p><strong>Date:</strong> {new Date(req.timestamp).toLocaleString()}</p>
                <ul>
                  {req.items.map((item, i) => (
                    <li key={i}>
                      {item.quantity} × {productNames[item.productId] || item.productId} at ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <div className="refund-buttons">
                  <button className="approve" onClick={() => handleApprove(req.requestId)}>Approve ✅</button>
                  <button className="reject" onClick={() => handleReject(req.requestId)}>Reject ❌</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
