import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const isEmpty = cart.length === 0;

  return (
    <>
      <Header />
      <div className={`cart-page ${isEmpty ? "empty" : "filled"}`}>
        {isEmpty ? (
          <>
            <h2>Your cart is empty.</h2>
            <p className="subtext">
              Looks like you haven't added anything to your cart yet. Let’s find you something nice.
            </p>
            <button onClick={() => navigate("/")}>Go to Products</button>
          </>
        ) : (
          <>
            <h2>Your Cart</h2>
            <div className="cart-content">
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} />
                    <div>
                      <h4>{item.title}</h4>
                      <p>${item.price} × {item.quantity}</p>
                      <button onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <h3>Total: ${totalPrice()}</h3>
                <button onClick={clearCart}>Clear Cart</button>
                <button onClick={() => navigate("/checkout")}>Checkout</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
