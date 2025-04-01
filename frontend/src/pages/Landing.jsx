import React, { useEffect, useState } from "react";
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTshirt,
  FaShoppingBag,
  FaMagic,
  FaTv,
  FaUserCircle,
  FaDumbbell,
  FaHome,
  FaAppleAlt,
} from "react-icons/fa";
import axios from "axios";
import "./Landing.css";
import ProductCard from "../components/ProductCard";

const iconMap = {
  Clothes: <FaTshirt />,
  "Shoes and Bags": <FaShoppingBag />,
  Cosmetics: <FaMagic />,
  Electronics: <FaTv />,
  Accessories: <FaUserCircle />,
  "Sports and Outdoor": <FaDumbbell />,
  "Home and Living": <FaHome />,
  Groceries: <FaAppleAlt />,
};

const Landing = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const dummyProducts = [
    {
      id: 1,
      title: "Minimalist Watch",
      price: 149.99,
      image: "/watch.jpg",
      description: "Sleek and stylish wristwatch for everyday wear.",
    },
    {
      id: 2,
      title: "Noise Cancelling Headphones",
      price: 299.99,
      image: "/headphone.jpg",
      description: "Block out the world with immersive sound.",
    },
    {
      id: 3,
      title: "Leather Backpack",
      price: 189.99,
      image: "/backpack.jpg",
      description: "Elegant and spacious for daily use.",
    },
    {
      id: 4,
      title: "Running Sneakers",
      price: 129.99,
      image: "/sneakers.jpg",
      description: "Designed for comfort and performance.",
    },
    {
      id: 5,
      title: "Smart Glasses",
      price: 249.99,
      image: "/glasses.jpg",
      description: "Futuristic eyewear with smart features.",
    },
    {
      id: 6,
      title: "Wireless Charger",
      price: 59.99,
      image: "/charger.jpg",
      description: "Fast and sleek wireless charging pad.",
    },
    {
      id: 7,
      title: "Fitness Tracker",
      price: 99.99,
      image: "/tracker.jpg",
      description: "Monitor your activity 24/7.",
    },
    {
      id: 8,
      title: "Smart Thermos",
      price: 79.99,
      image: "/thermos.jpg",
      description: "Keeps drinks at the perfect temperature.",
    },
    {
      id: 9,
      title: "Desk Lamp",
      price: 39.99,
      image: "/lamp.jpg",
      description: "Minimalist LED lamp with touch control.",
    },
    {
      id: 10,
      title: "Ergonomic Mouse",
      price: 49.99,
      image: "/mouse.jpg",
      description: "Smooth navigation and wrist-friendly.",
    },
    {
      id: 11,
      title: "Bluetooth Speaker",
      price: 89.99,
      image: "/speaker.jpg",
      description: "Crisp sound in a compact design.",
    },
    {
      id: 12,
      title: "Sustainable Water Bottle",
      price: 24.99,
      image: "/bottle.jpg",
      description: "Eco-friendly and stylish hydration.",
    },
  ];

  useEffect(() => {
    setCategories([
      { _id: "1", categoryName: "Clothes" },
      { _id: "2", categoryName: "Shoes and Bags" },
      { _id: "3", categoryName: "Electronics" },
      { _id: "4", categoryName: "Home and Living" },
      { _id: "5", categoryName: "Accessories" },
      { _id: "6", categoryName: "Cosmetics" },
      { _id: "7", categoryName: "Groceries" },
      { _id: "8", categoryName: "Sports and Outdoor" }
    ]);
  }, []);

  return (
    <div className="landing-container">
      {/* Header Section */}
      <header className="header">
        <h2 className="logo">Shipshak.com</h2>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <FaSearch className="search-icon" />
        </div>
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

      {/* Hero Section */}
      <div className="hero-card">
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to Shipshak.com</h1>
            <p>Your cart, your way, right away!</p>
          </div>
        </section>
      </div>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Categories</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              to={`/category/${cat._id}`}
              key={cat._id}
              className="category-card"
            >
              <div className="icon">
                {iconMap[cat.categoryName] || <FaShoppingBag />}
              </div>
              <div className="label">{cat.categoryName}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="product-showcase">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {dummyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;