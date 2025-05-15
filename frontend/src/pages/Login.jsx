// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "./Login.css";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    let tabId = sessionStorage.getItem("tabId");
  
    // ✅ Create a new tabId if not exists
    if (!tabId || tabId.includes(",")) {
      tabId = crypto.randomUUID();
      sessionStorage.setItem("tabId", tabId);
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );
  
      const {
        token,
        userId,
        name,
        surname,
        role,
        specificAddress,
        email: userEmail
      } = response.data;
  
      sessionStorage.setItem(`${tabId}-authToken`, token);
      sessionStorage.setItem(`${tabId}-userId`, userId);
      sessionStorage.setItem(`${tabId}-userName`, name);
      sessionStorage.setItem(`${tabId}-userSurname`, surname);
      sessionStorage.setItem(`${tabId}-role`, role);
      sessionStorage.setItem(`${tabId}-specificAddress`, specificAddress);
      sessionStorage.setItem(`${tabId}-email`, userEmail);
  
      // ✅ Role-based routing
      switch (role) {
        case "Customer":
          navigate("/");
          break;
        case "Product Manager":
          navigate("/product-manager");
          break;
        case "Sales Manager":
          navigate("/sales-manager");
          break;
        default:
          navigate("/"); // fallback
      }
  
    } catch (err) {
      setError("Invalid email or password");
    }
  };
  

  return (
    <>
      <Header />
      <div className="login-container">
        <h2>Welcome Back</h2>
        <button className="social-login google">Sign in with Google</button>
        <button className="social-login apple">Sign in with Apple</button>
        <p className="or-text">or</p>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-button">Sign In</button>
        </form>

        <p className="signup">
          New to Shipshak?{" "}
          <span onClick={() => navigate("/register")} className="signup-link">
            Sign up now
          </span>
        </p>
      </div>
    </>
  );
};

export default Login;
