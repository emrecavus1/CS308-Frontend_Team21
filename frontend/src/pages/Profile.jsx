// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let rawTabId = sessionStorage.getItem("tabId");
  
    if (!rawTabId) {
      navigate("/login");
      return;
    }
  
    // Sanitize tabId
    if (rawTabId.includes(",")) {
      rawTabId = rawTabId.split(",")[0];
      sessionStorage.setItem("tabId", rawTabId); // optional overwrite
    }
  
    const token = sessionStorage.getItem(`${rawTabId}-authToken`);
    const userId = sessionStorage.getItem(`${rawTabId}-userId`);
  
    if (!token || !userId) {
      navigate("/login");
      return;
    }
  
    axios.get(`http://localhost:8080/api/auth/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch(() => setError("Failed to load user profile."));
  }, []);
  
  
  

  if (error) {
    return (
      <>
        <Header />
        <div className="profile-container">
          <h2 className="error">{error}</h2>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  const handleLogout = async () => {
    let rawTabId = sessionStorage.getItem("tabId");
  
    if (!rawTabId) {
      window.location.href = "/login";
      return;
    }
  
    if (rawTabId.includes(",")) {
      rawTabId = rawTabId.split(",")[0];
    }
  
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(`${rawTabId}-authToken`)}`,
        },
      });
    } catch {}
  
    // Clean up
    sessionStorage.removeItem(`${rawTabId}-authToken`);
    sessionStorage.removeItem(`${rawTabId}-userId`);
    sessionStorage.removeItem(`${rawTabId}-userName`);
    sessionStorage.removeItem(`${rawTabId}-userSurname`);
    sessionStorage.removeItem(`${rawTabId}-role`);
    sessionStorage.removeItem(`${rawTabId}-specificAddress`);
    sessionStorage.removeItem(`${rawTabId}-email`);
  
    window.location.href = "/login";
  };
  
  
  

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1 className="profile-title">Your Profile</h1>
        <div className="profile-info">
          <p><strong>User ID:</strong> {user.userId}</p> 
          <p><strong>Name:</strong> {user.name} {user.surname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>City:</strong> {user.city}</p>
          <p><strong>Address:</strong> {user.specificAddress}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Tax ID:</strong> {user.taxId} </p>
        </div>
        <div className="profile-actions">
            <button className="profile-button" onClick={() => navigate("/order-history")}>
                View Order History
            </button>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
      </div>
    </>
  );
}
