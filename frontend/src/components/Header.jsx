// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import "./Header.css";

export default function Header({
  onSearch = () => {},              // no-op default
  searchResults = [],
  onSelectProduct = () => {}        // no-op default
}) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [query, setQuery] = useState("");

  // close dropdown if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setQuery("");
        onSearch("");
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [onSearch]);

  // whenever the user types
  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    onSearch(q);
  };

  // when they pick one of the autocomplete items
  const handleSelect = (productId) => {
    onSelectProduct(productId);
    setQuery("");
    onSearch("");
  };

  return (
    <header className="site-header" ref={containerRef}>
      <h2 className="logo" onClick={() => navigate("/")}>
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

      {searchResults.length > 0 && (
        <ul className="autocomplete-list">
          {searchResults.map((p) => (
            <li
              key={p.productId}
              onClick={() => handleSelect(p.productId)}
            >
              <strong>{p.productName}</strong>
              <span>Stock: {p.stockCount}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="icons">
        <FaHeart className="icon" />
        <FaShoppingCart
          className="icon clickable-icon"
          onClick={() => navigate("/cart")}
        />
        <FaUser
          className="icon clickable-icon"
          onClick={() => navigate("/login")}
        />
      </div>
    </header>
  );
}
