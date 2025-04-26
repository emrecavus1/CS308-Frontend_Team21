import { useNavigate } from "react-router-dom";
import { useCart }     from "../context/CartContext";
import "./ProductCard.css";
const PLACEHOLDER =
  "https://via.placeholder.com/240x160?text=No+image";

export default function ProductCard({ product }) {
  const nav        = useNavigate();
  const { addToCart } = useCart();

  const toDetail = () =>
    nav(`/product/${product._id}`, { state: product }); // click-through

  const out     = product.stockCount === 0;

  return (
    <div className="card" onClick={toDetail}>
      <img
        src={product.imageUrl || PLACEHOLDER}
        alt={product.productName}
      />

      <h4>{product.productName}</h4>
      <p className="price">${Number(product.price).toFixed(2)}</p>

      <button
        className="add-btn"
        disabled={out}
        onClick={(e) => {
          e.stopPropagation();       // don’t open detail
          if (!out) addToCart(product);
        }}
      >
        {out ? "Out of stock" : "Add to Cart"}
      </button>
    </div>
  );
}
