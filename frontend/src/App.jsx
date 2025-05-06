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
import AddRemoveCategory from "./pages/AddRemoveCategory";
import UpdateStock from "./pages/UpdateStock";
import AddRemoveProduct from "./pages/AddRemoveProduct";
import AddProduct from "./pages/AddProduct";
import RemoveProduct from "./pages/RemoveProduct";
import UpdatePrice from "./pages/UpdatePrice";
import Profile from "./pages/Profile";
import Comments from "./pages/Comments";
import Orders from "./pages/Orders";
import SetPrice from "./pages/SetPrice";
import SetDiscount from "./pages/SetDiscount";
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
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product-manager" element={ <ProductManager />} />
          <Route path="/sales-manager" element={ <SalesManager />} />
          <Route path="/product-manager/add-remove-category" element={ <AddRemoveCategory />} />
          <Route path="/product-manager/update-stock" element={ <UpdateStock />} />
          <Route path="/product-manager/add-remove-product" element={<AddRemoveProduct />} />
          <Route path="/product-manager/add-product" element={<AddProduct />} /> {/* placeholder later */}
          <Route path="/product-manager/remove-product" element={<RemoveProduct />} /> {/* placeholder later */} 
          <Route path="/sales-manager/update-price" element={<UpdatePrice />} />  
          <Route path="/profile" element={<Profile />} />  
          <Route path="/product-manager/comments" element={ <Comments />} /> 
          <Route path="/product-manager/orders" element = { <Orders />} />
          <Route path="/sales-manager/set-price" element = { <SetPrice />} />
          <Route path="/sales-manager/set-discount" element = { <SetDiscount />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;