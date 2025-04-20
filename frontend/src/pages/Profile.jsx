// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      // Not logged in, go to login page
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null; // or a loading spinner

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Profile Page</h1>
        <div className="profile-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Surname:</strong> {user.surname}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>City:</strong> {user.city}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          <p><strong>Address:</strong> {user.specificAddress}</p>
        </div>

        {/* Only show this button if user is a Product Manager */}
        {user.role === "Product Manager" && (
          <button className="pm-button" onClick={() => navigate("/product_manager")}>
            Go to Product Manager
          </button>
        )}

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
