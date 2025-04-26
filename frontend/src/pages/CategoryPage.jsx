// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import "./CategoryPage.css";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  // --- Category products state ---
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // load products for this category
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/main/category/${categoryId}/getProductsByCategory`)
      .then(res => {
        // adjust if your API wraps the array
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.products)
            ? res.data.products
            : [];
        setProducts(list);
      })
      .catch(err => {
        console.error(err);
        setError("Could not load products.");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  // --- Search state & handler (just like Landing.jsx) ---
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = (q) => {
    if (!q) return setSearchResults([]);
    axios
      .get(`http://localhost:8080/api/main/search?query=${encodeURIComponent(q)}`)
      .then(res => setSearchResults(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSearchResults([]));
  };

  return (
    <div className="category-page">
      {/* 1) Header + instant-search */}
      <Header
        onSearch={handleSearch}
        searchResults={searchResults}
        onSelectProduct={id => navigate(`/product/${id}`)}
      />

      {/* 2) Category title */}
      <h1 className="category-title">
        Products in “{categoryId}”
      </h1>

      {/* 3) Content */}
      {loading ? (
        <p className="center">Loading…</p>
      ) : error ? (
        <p className="center error">{error}</p>
      ) : products.length === 0 ? (
        <p className="center">No products found in this category.</p>
      ) : (
        <div className="products-grid">
          {products.map(prod => {
            // normalize into ProductCard’s props
            const cardData = {
              id:          prod.id ?? prod.productId,
              title:       prod.title ?? prod.productName,
              price:       prod.price,
              image:       prod.image || prod.imageUrl,
              description: prod.description,
            };
            return (
              <ProductCard
                key={cardData.id}
                product={cardData}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
