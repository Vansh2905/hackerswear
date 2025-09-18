"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { RiSubtractFill } from "react-icons/ri";
import { MdDeleteForever, MdAccountCircle } from "react-icons/md";
import { useCart } from "./CartProvider";
import { useUser } from "./UserProvider";
import PropTypes from "prop-types";
// ---------------- User Dropdown ----------------
const UserDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const { logout } = useUser();
  return (
    <div
      className="relative"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {user ? (
        <MdAccountCircle
          aria-label="User account menu"
          className="text-xl md:text-2xl hover:cursor-pointer hover:text-gray-300"
        />
      ) : (
        <Link href="/Login">
          <button className="bg-white text-black px-3 py-1 rounded hover:bg-blue-500  hover:text-white text-sm">
            Login
          </button>
        </Link>
      )}

      {open && user && (
        <div
          role="menu"
          className="absolute right-0 w-48 bg-black text-white rounded shadow-lg z-50"
        >
          <ul className="py-2">
            <li>
              <Link
                href="/account"
                role="menuitem"
                className="block px-4 py-2 font-bold hover:bg-gray-200 hover:text-black"
              >
                My Account
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                role="menuitem"
                className="block px-4 py-2 font-bold hover:bg-gray-200 hover:text-black"
              >
                Orders
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                role="menuitem" 
                className="w-full text-left block px-4 py-2 font-bold hover:bg-red-500  cursor-pointer hover:text-white"
              >
                Logout  
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};


// ---------------- Cart Sidebar ----------------
const CartSidebar = ({
  cart,
  cartOpen,
  setCartOpen,
  subTotal,
  addCart,
  removeFromCart,
  clearCart,
}) => {
  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <button
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out"
          aria-label="Close cart overlay"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-950 text-white p-6 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h2 className="font-bold text-xl mx-5">Shopping Cart</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="text-red-500 hover:cursor-pointer hover:text-red-400"
            aria-label="Close cart"
          >
            X
          </button>
        </div>

        {/* Cart Items */}
        <ol className="mt-4 space-y-2 list-decimal mx-2 font-semibold">
          {Object.keys(cart).length === 0 ? (
            <div className="text-center text-gray-400">Your cart is empty</div>
          ) : (
            Object.keys(cart).map((k) => {
              const item = cart[k];
              return (
                <li
                  key={`${k}-${item.size}-${item.variant}`}
                  className="border-b border-gray-600 pb-2"
                >
                  <div className="item flex justify-between items-center">
                    <div className="flex-1">{item.name}</div>
                    <div className="flex items-center">
                      <button
                        aria-label="Remove item"
                        onClick={() =>
                          removeFromCart(
                            k,
                            1,
                            item.price,
                            item.name,
                            item.size,
                            item.variant
                          )
                        }
                        className="bg-white text-gray-600 mx-2 p-1 rounded-full hover:bg-red-500 hover:text-white"
                      >
                        <RiSubtractFill />
                      </button>
                      <div className="qty w-6 text-center">{item.qty}</div>
                      <button
                        aria-label="Add item"
                        onClick={() =>
                          addCart(
                            k,
                            1,
                            item.price,
                            item.name,
                            item.size,
                            item.variant
                          )
                        }
                        className="bg-white text-gray-600 mx-2 p-1 rounded-full hover:bg-blue-500 hover:text-white"
                      >
                        <IoIosAdd />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ol>

        {/* Subtotal & Buttons */}
        {Object.keys(cart).length > 0 && (
          <>
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="text-lg font-bold mb-4">
                Subtotal: ₹{subTotal.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="flex justify-start">
              <Link href="/checkout">
                <button onClick={()=>{
                  setCartOpen(false);
                }}className="flex mt-4 mx-1 bg-white text-black py-1 px-2 rounded text-lg hover:bg-blue-500 hover:text-white">
                  <FaShoppingBag className="my-1 mx-2" />
                  Checkout
                </button>
              </Link>
              <button
                onClick={clearCart}
                aria-label="Clear cart"
                className="flex mt-4 mx-1 bg-white text-black py-1 px-2 rounded text-lg hover:bg-red-500 hover:text-white"
              >
                <MdDeleteForever className="mx-1 my-1 text-xl" /> Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};


// ---------------- Main Navbar ----------------
const Navbar = () => {
  const {
    cart,
    subTotal,
    addCart,
    removeFromCart,
    clearCart,
    cartOpen,
    setCartOpen,
  } = useCart();
  const { user} = useUser();

  return (
    <>
      {/* Navbar */}
      <div className="flex flex-col md:flex-row md:justify-start justify-center items-center bg-black text-white p-2 py-3 sticky top-0 z-50">
        {/* Logo */}
        <div className="logo mx-5">
          <Link href="/">
            <Image width={50} height={120} src={Logo} alt="Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav">
          <ul className="flex justify-between space-x-6 font-bold">
            <li>
              <Link href="/Tshirts" className="hover:text-gray-200">
                Tshirts
              </Link>
            </li>
            <li>
              <Link href="/Hoodies" className="hover:text-gray-200">
                Hoodies
              </Link>
            </li>
            <li>
              <Link href="/Mugs" className="hover:text-gray-200">
                Mugs
              </Link>
            </li>
            <li>
              <Link href="/Stickers" className="hover:text-gray-200">
                Stickers
              </Link>
            </li>
          </ul>
        </div>

        {/* Right side buttons */}
        <div className="absolute right-4 top-4 flex items-center space-x-4">
          <UserDropdown user={user} />
          <button
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
          >
            <FaShoppingCart className="text-xl md:text-2xl hover:cursor-pointer hover:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        subTotal={subTotal}
        addCart={addCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </>
  );
};
Navbar.propTypes = {
  cart: PropTypes.object,
  cartOpen: PropTypes.bool,
  setCartOpen: PropTypes.func,
  subTotal: PropTypes.number,
  addCart: PropTypes.func,
  removeFromCart: PropTypes.func,
  clearCart: PropTypes.func,
};
export default Navbar;
