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

  // friendly name (fallback to ID)
  const [categoryName, setCategoryName] = useState(categoryId);
  const [products,       setProducts]   = useState([]);
  const [loading,        setLoading]    = useState(true);
  const [error,          setError]      = useState("");

  // 1) load the human-readable category name (if you have that endpoint)
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/main/category/${categoryId}`)
      .then(res => {
        const friendly = res.data.name || res.data.categoryName;
        if (friendly) setCategoryName(friendly);
      })
      .catch(() => {/* ignore, keep the ID */});
  }, [categoryId]);

  // 2) fetch the full product list, then pluck out every field we need:
  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`http://localhost:8080/api/main/category/${categoryId}/getProductsByCategory`)
      .then(res => {
        // your backend should already be returning full product objects
        const raw = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.products)
            ? res.data.products
            : [];

        setProducts(raw.map(p => ({
          productId:      p.productId,
          productName:    p.productName,
          serialNumber:   p.serialNumber,
          categoryId:     p.categoryId,
          price:          p.price,
          stockCount:     p.stockCount,
          rating:         p.rating,
          productInfo:    p.productInfo,
          warrantyStatus: p.warrantyStatus,
          distributorInfo:p.distributorInfo,
          reviewIds:      p.reviewIds 
        })));
      })
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <>
      <Header />
      <button className="back-button" onClick={() => navigate(-1)}>← Back </button>

      <div className="category-page">
        <h1 className="category-title">
          Products in “{categoryName}”
        </h1>

        {loading ? (
          <p className="center">Loading…</p>
        ) : error ? (
          <p className="center error">{error}</p>
        ) : products.length === 0 ? (
          <p className="center">No products in this category.</p>
        ) : (
          <div className="products-grid">
            {products.map(p => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
