import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      console.log("Login successful", response.data);
      navigate("/"); // Redirect to home after login
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
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
        <div className="remember-forgot">
          <div>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <p className="forgot-password">Forgot your password?</p>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">Sign In</button>
      </form>
      <p className="signup">New to Shipshak? <span onClick={() => navigate("/register")} className="signup-link">Sign up now</span></p>
    </div>
  );
};

export default Login;
