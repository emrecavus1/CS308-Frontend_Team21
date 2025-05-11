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
    const tabId = sessionStorage.getItem("tabId");
    const userId = sessionStorage.getItem(`${tabId}-userId`);
    if (!userId) {
      navigate("/login");
      return;
    }
  
    axios.get(`http://localhost:8080/api/auth/user/${userId}`)
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
      <div className="profile-container">
        <h1 className="profile-title">Your Profile</h1>
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name} {user.surname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>City:</strong> {user.city}</p>
          <p><strong>Address:</strong> {user.specificAddress}</p>
          <p><strong>Role:</strong> {user.role}</p>
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
