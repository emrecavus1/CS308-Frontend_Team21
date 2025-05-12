import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import "./CategoryPage.css";

export default function CategoryPage() {
  const navigate       = useNavigate();
  const { categoryId } = useParams();

  const [categoryName, setCategoryName] = useState(categoryId);
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  const [page, setPage] = useState(0);
  const productsPerPage = 4;

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/main/category/${categoryId}`)
      .then(res => {
        const friendly = res.data.name || res.data.categoryName;
        if (friendly) setCategoryName(friendly);
      })
      .catch(() => {});
  }, [categoryId]);

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`http://localhost:8080/api/main/category/${categoryId}/showProductsByCategory`)
      .then(res => {
        const raw = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.products)
            ? res.data.products
            : [];

        setProducts(raw.map(p => ({
          productId:       p.productId,
          productName:     p.productName,
          serialNumber:    p.serialNumber,
          categoryId:      p.categoryId,
          price:           p.price,
          stockCount:      p.stockCount,
          rating:          p.rating,
          productInfo:     p.productInfo,
          warrantyStatus:  p.warrantyStatus,
          distributorInfo: p.distributorInfo,
          reviewIds:       p.reviewIds 
        })));
        setPage(0); // reset to first page on reload
      })
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const paginatedProducts = products.slice(page * productsPerPage, (page + 1) * productsPerPage);

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
          <>
            <div className="products-grid">
              {paginatedProducts.map(p => (
                <ProductCard key={p.productId} product={p} />
              ))}
            </div>

            <div className="pagination-controls">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={(page + 1) * productsPerPage >= products.length}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
