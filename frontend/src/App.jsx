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
import Wishlist from "./pages/Wishlist"; 
import ProductManager from "./pages/ProductManager";
import SalesManager from "./pages/SalesManager";
// at the very top of App.jsx



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
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product-manager" element={ <ProductManager />} />
          <Route path="/sales-manager" element={ <SalesManager />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;