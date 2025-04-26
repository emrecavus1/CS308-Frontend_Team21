// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import "./CategoryPage.css";

export default function CategoryPage() {
  const navigate       = useNavigate();
  const { categoryId } = useParams();

  const [products, setProducts]             = useState([]);
  const [loading,  setLoading]              = useState(true);
  const [error,    setError]                = useState(null);
  const [searchResults, setSearchResults]   = useState([]);

  // 1) Fetch & normalize products
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8080/api/main/category/${categoryId}/getProductsByCategory`
      )
      .then((res) => {
        // pull out the raw array
        const rawList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.products)
            ? res.data.products
            : [];

        // normalize each product so <ProductCard> sees the same shape always
        const normalized = rawList.map((p) => ({
          productId:   p.productId,
          productName: p.productName,
          price:       p.price,
          stockCount:  p.stockCount,
          image:       p.image || p.imageUrl || "/placeholder.png",
          productInfo: p.productInfo,
        }));

        setProducts(normalized);
      })
      .catch(() => {
        setError("Could not load products.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

  // 2) Search handler (unchanged)
  const handleSearch = (q) => {
    if (!q) return setSearchResults([]);
    axios
      .get(
        `http://localhost:8080/api/main/search?query=${encodeURIComponent(q)}`
      )
      .then((res) =>
        setSearchResults(Array.isArray(res.data) ? res.data : [])
      )
      .catch(() => setSearchResults([]));
  };

  return (
    <div className="category-page">
      {/* fixed header with search */}
      <Header
        onSearch={handleSearch}
        searchResults={searchResults}
        onSelectProduct={(id) => {
          const p = searchResults.find(x => x.productId === id);
          navigate(`/product/${id}`, { state: p });
        }}
      />

      <div className="products-container">
        <h1 className="category-title">Products in “{categoryId}”</h1>

        {loading ? (
          <p className="center">Loading…</p>
        ) : error ? (
          <p className="center error">{error}</p>
        ) : products.length === 0 ? (
          <p className="center">No products found in this category.</p>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
