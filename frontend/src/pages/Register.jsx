// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    role: "",
    city: "",
    phoneNumber: "",
    specificAddress: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await axios.post("http://localhost:8080/api/auth/signup", formData);
      alert("Registration successful!");

      // Store in localStorage for user details (front-end only)
      const stored = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      if (!stored.some(u => u.email === formData.email)) {
        stored.push(formData);
        localStorage.setItem("registeredUsers", JSON.stringify(stored));
      }

      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error(err);
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create an account</h1>

        {errors.length > 0 && (
          <div className="register-errors">
            <ul>
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <form onSubmit={handleRegister} className="register-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (8+ chars)"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="First name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="surname"
            placeholder="Last name"
            required
            value={formData.surname}
            onChange={handleChange}
          />
          <select name="role" required value={formData.role} onChange={handleChange}>
            <option value="">-- Select Role --</option>
            <option value="Customer">Customer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Sales Manager">Sales Manager</option>
          </select>
          <input
            type="text"
            name="city"
            placeholder="City"
            required
            value={formData.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone number (11 digits, start 0)"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <textarea
            name="specificAddress"
            placeholder="Specific address (>=15 chars)"
            required
            value={formData.specificAddress}
            onChange={handleChange}
          />
          <button type="submit">Create Account</button>
        </form>
        <p className="register-footer-text">
          By creating an account, you agree to Shipshak's Terms of Use and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default Register;
