// src/pages/Landing.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Landing.css";

import {
  FaTshirt,
  FaShoppingBag,
  FaMagic,
  FaTv,
  FaDumbbell,
  FaHome,
  FaAppleAlt,
  FaCar,
  FaBook,
  FaPuzzlePiece,
  FaBriefcase,
  FaStar
} from "react-icons/fa";

/* Icon map for categories */
const iconMap = {
  Electronics: <FaTv />,
  Books: <FaBook />,
  Clothing: <FaTshirt />,
  Sports: <FaDumbbell />,
  "Home & Kitchen": <FaHome />,
  Beauty: <FaMagic />,
  Toys: <FaPuzzlePiece />,
  Automotive: <FaCar />,
  Grocery: <FaAppleAlt />,
  "Office Supplies": <FaBriefcase />,
  Bags: <FaShoppingBag />,
};

export default function Landing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [sortField, setSortField] = useState("");

  // load categories
  useEffect(() => {
    axios.get("http://localhost:8080/api/main/getCategories")
      .then(res => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.categories)
            ? res.data.categories
            : [];
        setCategories(data);
      })
      .catch(() => setCategories([]));
  }, []);

  // search handler
  const handleSearch = (q) => {
    if (!q) return setSearchResults([]);
    axios.get(`http://localhost:8080/api/main/search?query=${encodeURIComponent(q)}`)
      .then(res => setSearchResults(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSearchResults([]));
  };

  // sort handlers
  const handleSortPriceAsc = () => {
    axios.get("http://localhost:8080/api/main/sortProductsByPriceAsc")
      .then(res => {
        setSortedResults(res.data || []);
        setSortField("price (asc)");
      })
      .catch(() => {
        setSortedResults([]);
        setSortField("");
      });
  };

  const handleSortPriceDesc = () => {
    axios.get("http://localhost:8080/api/main/sortProductsByPriceDesc")
      .then(res => {
        setSortedResults(res.data || []);
        setSortField("price (desc)");
      })
      .catch(() => {
        setSortedResults([]);
        setSortField("");
      });
  };

  const handleSortRatingAsc = () => {
    axios.get("http://localhost:8080/api/main/sortProductsByRatingAsc")
      .then(res => {
        setSortedResults(res.data || []);
        setSortField("rating (asc)");
      })
      .catch(() => {
        setSortedResults([]);
        setSortField("");
      });
  };

  const handleSortRatingDesc = () => {
    axios.get("http://localhost:8080/api/main/sortProductsByRatingDesc")
      .then(res => {
        setSortedResults(res.data || []);
        setSortField("rating (desc)");
      })
      .catch(() => {
        setSortedResults([]);
        setSortField("");
      });
  };

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="landing-page">
      {/* 1) Header + instant-search */}
      <Header
        onSearch={handleSearch}
        searchResults={searchResults}
        onSelectProduct={(id) => {
          const p = searchResults.find(x => x.productId === id);
          navigate(`/product/${id}`, { state: p });
        }}
      />

      {/* 2) Hero (only when no search) */}
      {searchResults.length === 0 && (
        <div className="hero-section">
          <div className="hero-overlay">
            <h1>Welcome to Shipshak.com</h1>
            <p>Your cart, your way, right away!</p>
          </div>
        </div>
      )}

      {/* 3) Categories */}
      <section className="categories-section">
        <h2>Categories</h2>
        <div className="category-grid">
          {categories.map(cat => (
            <div
              key={cat.categoryName}
              className="category-card"
              onClick={() => navigate(`/category/${cat.categoryId}`)}
            >
              <div className="icon">
                {iconMap[cat.categoryName] || <FaShoppingBag />}
              </div>
              <div className="label">{cat.categoryName}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4+5) Sort section (buttons + floating results) */}
      <div className="sort-section">
        <div className="sort-buttons">
          <button onClick={handleSortPriceAsc}>Price ↑</button>
          <button onClick={handleSortPriceDesc}>Price ↓</button>
          <button onClick={handleSortRatingAsc}>Rating ↑</button>
          <button onClick={handleSortRatingDesc}>Rating ↓</button>
        </div>

        {sortedResults.length > 0 && (
          <div className="sorted-dropdown">
            <h2>Sorted by {capitalize(sortField)}</h2>
            <ul>
              {sortedResults.map(p => (
                <li 
                  key={p.productId}
                  className="sorted-item"
                  onClick={() => navigate(`/product/${p.productId}`, { state: p })}
                >
                  <strong>{p.productName}</strong> — {sortField.includes("price") ? (`$${p.price}`) : (<>{p.rating?.toFixed(2)}<span className="star-icon">★</span></>)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}