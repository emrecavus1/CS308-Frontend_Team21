import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/ProductGrid.css";

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // GET products from backend
    axios
      .get(`http://localhost:8080/api/main/category/${categoryId}/getProductsByCategory`)
      .then((res) => {
        console.log("Fetched products:", res.data);
        setProducts(res.data.products || []); // safe access
      })
      .catch((err) => console.error("Error loading products", err));

    // GET category name using ID
    axios
      .get("http://localhost:8080/api/main/getCategories")
      .then((res) => {
        const found = res.data.categories.find((cat) => cat.categoryId === categoryId);
        setCategoryName(found?.categoryName || "");
      })
      .catch((err) => console.error("Error loading category name", err));
  }, [categoryId]);

  return (
    <div className="category-page">
      <button onClick={() => navigate(-1)}>← Back to Categories</button>
      <h2>Products in “{categoryName}”</h2>

      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
