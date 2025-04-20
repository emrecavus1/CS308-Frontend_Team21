import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Product_Manager.css"; // optional styling

function ProductManager() {
  // State for categories
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  // State for products
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  // State for unapproved comments (optional)
  const [comments, setComments] = useState([]);

  // For error messages
  const [error, setError] = useState("");

  // ---------------------------------------------------
  // 1) GET CATEGORIES (GET /api/main/getCategories)
  // ---------------------------------------------------
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/main/getCategories")
      .then((res) => {
        // If your backend returns { categories: [...] }, do:
        if (Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        } else {
          console.error("getCategories did not return an array:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories. Check console.");
      });
  }, []);

  // ---------------------------------------------------
  // 2) ADD NEW CATEGORY (POST /api/main/addCategory)
  // ---------------------------------------------------
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    axios
      .post("http://localhost:8080/api/main/addCategory", {
        categoryName: newCategoryName,
      })
      .then(() => {
        setNewCategoryName("");
        // Refresh categories
        return axios.get("http://localhost:8080/api/main/getCategories");
      })
      .then((res) => {
        if (Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => {
        console.error("Error adding category:", err);
        setError("Failed to add category. Check console for details.");
      });
  };

  // ---------------------------------------------------
  // 3) ADD PRODUCT (POST /api/main/addProduct?categoryName=...)
  // ---------------------------------------------------
  const handleAddProduct = () => {
    const { name, description, price, stock, category } = newProduct;
    if (!name || !description || !price || !stock || !category) {
      alert("Please fill all product fields, including category.");
      return;
    }

    axios
      .post(`http://localhost:8080/api/main/addProduct?categoryName=${category}`, {
        name,
        description,
        price,
        stock,
      })
      .then(() => {
        alert("Product added successfully!");
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
        });
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        setError("Failed to add product. Check console for details.");
      });
  };

  // ---------------------------------------------------
  // 4) FETCH UNAPPROVED COMMENTS (OPTIONAL)
  //    If you don't need it, comment out
  // ---------------------------------------------------
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/main/unapprovedComments") // if it doesn't exist, remove or comment out
      .then((res) => {
        if (Array.isArray(res.data)) {
          setComments(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching unapproved comments:", err);
        // If this 404s or doesn't exist, just comment out
      });
  }, []);

  const handleApproveComment = (id) => {
    axios
      .post(`http://localhost:8080/api/main/approveReview/${id}`)
      .then(() => {
        setComments((prev) => prev.filter((c) => c._id !== id));
      })
      .catch((err) => {
        console.error("Error approving comment:", err);
        setError("Failed to approve comment. Check console.");
      });
  };

  return (
    <div className="pm-container">
      <h1>Product Manager Dashboard</h1>

      {error && <p className="pm-error">{error}</p>}

      {/* ADD NEW CATEGORY */}
      <section className="pm-section">
        <h2>Add New Category</h2>
        <div className="pm-form-group">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button onClick={handleAddCategory}>Add Category</button>
        </div>
      </section>

      {/* LIST CATEGORIES */}
      <section className="pm-section">
        <h2>Existing Categories</h2>
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <ul>
            {categories.map((cat) => (
              <li key={cat.id || cat._id}>{cat.categoryName}</li>
            ))}
          </ul>
        )}
      </section>

      {/* ADD NEW PRODUCT */}
      <section className="pm-section">
        <h2>Add New Product</h2>
        <div className="pm-form-col">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          >
            <option value="">-- Select a Category --</option>
            {categories.map((cat) => (
              <option key={cat.id || cat._id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          <button onClick={handleAddProduct}>Add Product</button>
        </div>
      </section>

      {/* APPROVE COMMENTS */}
      <section className="pm-section">
        <h2>Approve Comments</h2>
        {comments.length === 0 ? (
          <p>No comments awaiting approval.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="pm-comment">
              <p>
                <strong>{comment.user || "User"}:</strong> {comment.text}
              </p>
              <button onClick={() => handleApproveComment(comment._id)}>Approve</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default ProductManager;
