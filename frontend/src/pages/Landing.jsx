import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

import {
  FaTshirt,
  FaShoppingBag,
  FaMagic,
  FaTv,
  FaUserCircle,
  FaDumbbell,
  FaHome,
  FaAppleAlt,
  FaCar,
  FaBook,
  FaPuzzlePiece,
  FaBriefcase,
} from "react-icons/fa";

import "./Landing.css";

/* Icon map for categories */
const iconMap = {
  Electronics: <FaTv />,
  Books: <FaBook />,                    // Updated icon
  Clothing: <FaTshirt />,
  Sports: <FaDumbbell />,
  "Home & Kitchen": <FaHome />,
  Beauty: <FaMagic />,
  Toys: <FaPuzzlePiece />,              // Updated icon
  Automotive: <FaCar />,                // Updated icon
  Grocery: <FaAppleAlt />,
  "Office Supplies": <FaBriefcase />,   // Updated icon
  Bags: <FaShoppingBag />,
};

export default function Landing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/main/getCategories")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.categories)
          ? res.data.categories
          : [];
        setCategories(list);
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
        setCategories([]);
      });
  }, []);

  return (
    <div className="landing-page">
      <Header />

      <div className="hero-section">
        <div className="hero-overlay">
          <h1>Welcome to Shipshak.com</h1>
          <p>Your cart, your way, right away!</p>
        </div>
      </div>

      <section className="categories-section">
        <h2>Categories</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.categoryName}
              className="category-card"
              onClick={() =>
                navigate(`/category/${encodeURIComponent(cat.categoryName)}`)
              }
            >
              <div className="icon">
                {iconMap[cat.categoryName] || <FaShoppingBag />}
              </div>
              <div className="label">{cat.categoryName}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
