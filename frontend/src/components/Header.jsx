// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser, FaHome } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  const navigate     = useNavigate();
  const containerRef = useRef(null);

  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);

  // ✅ Use sessionStorage instead of localStorage
  const tabId = sessionStorage.getItem("tabId");
  const token = sessionStorage.getItem(`${tabId}-authToken`);
  const role  = sessionStorage.getItem(`${tabId}-role`);
  

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setQuery("");
        setResults([]);
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);

    if (!q) {
      setResults([]);
      return;
    }

    fetch(`http://localhost:8080/api/main/search?query=${encodeURIComponent(q)}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setResults(Array.isArray(data) ? data : []);
      })
      .catch(() => setResults([]));
  };

  const handleSelect = (product) => {
    setQuery("");
    setResults([]);
    navigate(`/product/${product.productId}`, { state: product });
  };

  const handleHomeClick = () => {
    if (role === "Product Manager") navigate("/product-manager");
    else if (role === "Sales Manager") navigate("/sales-manager");
    else navigate("/");
  };

  return (
    <header className="site-header" ref={containerRef}>
      <h2 className="logo" onClick={handleHomeClick}>
        Shipshak.com
      </h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products, categories..."
          value={query}
          onChange={handleChange}
        />
      </div>

      {results.length > 0 && (
        <ul className="autocomplete-list">
          {results.map((p) => (
            <li key={p.productId} onClick={() => handleSelect(p)}>
              <strong>{p.productName}</strong>
              <span>Stock: {p.stockCount}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="icons">
        <FaHome className="icon clickable-icon" onClick={handleHomeClick} />
        <FaHeart className="icon clickable-icon" onClick={() => navigate("/wishlist")} />
        <FaShoppingCart className="icon clickable-icon" onClick={() => navigate("/cart")} />
        <FaUser
          className="icon clickable-icon"
          onClick={() => {
            if (token) navigate("/profile");
            else navigate("/login");
          }}
        />
      </div>
    </header>
  );
}
