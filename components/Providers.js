"use client";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/components/UserProvider";
import CartProvider from "@/components/CartProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <UserProvider>
        <CartProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </CartProvider>
      </UserProvider>
    </SessionProvider>
  );
}