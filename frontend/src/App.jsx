import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import CategoryPage from './pages/CategoryPage';
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
// at the very top of App.jsx


// ✅ Example mock products (you can replace this with your actual data)
const mockProducts = [
  { id: 1, title: "Product A", price: 29.99, image: "link-to-image-a.jpg" },
  { id: 2, title: "Product B", price: 49.99, image: "link-to-image-b.jpg" },
];

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<OrderHistory />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;