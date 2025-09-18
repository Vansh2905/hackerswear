"use client";
import { createContext, useContext, useState, useEffect,useMemo} from "react";
import PropTypes from "prop-types";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      calculateSubTotal(parsedCart);
    }
  }, []);

  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    calculateSubTotal(cart);
  };

  const calculateSubTotal = (cart) => {
    let total = 0;
    for (let item in cart) {
      if (cart[item].price) {
        total += cart[item].price * cart[item].qty;
      }
    }
    setSubTotal(total);
  };

  const addCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty += qty;
    } else {
      newCart[itemCode] = { qty: 1, price, name, size, variant };
    }
    setCart(newCart);
    saveCart(newCart);
    setCartOpen(true);
  };

  const removeFromCart = (itemCode, qty) => {
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const BuyNow = (itemCode, qty, price, name, size, variant) => {
    let newCart = { [itemCode]: { qty, price, name, size, variant } };
    clearCart();
    setCart(newCart);
    saveCart(newCart);
  };
   const contextValue = useMemo(
    () => ({
      cart,
      subTotal,
      addCart,
      BuyNow,
      removeFromCart,
      clearCart,
      cartOpen,
      setCartOpen,
    }),
    [cart, subTotal, cartOpen] // dependencies
  );

  return (
    <CartContext.Provider
      value={contextValue}
    >
      {children}
    </CartContext.Provider>
  );
}
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};