import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail"; // yeni

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} /> {/* yeni */}
      </Routes>
    </CartProvider>
  );
}

export default App;