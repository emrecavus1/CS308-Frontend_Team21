// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:8080/api/auth/login", formData);
      // "Login successful!"

      const stored = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const foundUser = stored.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (foundUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      } else {
        // fallback
        localStorage.setItem("loggedInUser", JSON.stringify({
          email: formData.email,
          password: formData.password,
        }));
      }
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data); // e.g. "Email not registered" or "Incorrect password"
      } else {
        console.error(err);
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>

        {/* Social sign-in buttons (mock) */}
        <button className="social-btn google-btn">Sign in with Google</button>
        <button className="social-btn apple-btn">Sign in with Apple</button>

        <div className="login-separator">or</div>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="login-extra">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember"> Remember me</label>
            </div>
            <a href="#forgot">Forgot your password?</a>
          </div>

          <button type="submit" className="login-submit">Sign In</button>
        </form>

        <p className="login-bottom-text">
          New to Shipshak? <a href="/register">Sign up now</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
