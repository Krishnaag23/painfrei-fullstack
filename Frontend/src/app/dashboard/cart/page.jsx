"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/navigation";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // Fetch Cart Data from Backend
  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "carts/",
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      setCart(response.data.data);
    } catch (err) {
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  // Remove Item from Cart
  const handleRemove = async (itemId) => {
    try {
      const response = await axios.delete(
        process.env.NEXT_PUBLIC_BACKEND_URL + `carts/${itemId}`,
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      setSuccessMsg("Item removed successfully.");
      await fetchCart(); // Re-fetch updated cart after removal
    } catch {
      setError("Failed to remove item.");
    }
  };

  // Update Item Quantity
  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return; // Prevent invalid quantity

    try {
      await axios.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + `carts/${itemId}`,
        { quantity },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      setSuccessMsg("Quantity updated.");
      await fetchCart(); // Re-fetch updated cart after quantity change
    } catch {
      setError("Failed to update item quantity.");
    }
  };

  // Apply Coupon Code
  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "carts/apply-coupon",
        { code: couponCode },
        { headers: { token: `${localStorage.getItem("token")}` } },
      );
      setCart(response.data.cart);
      setCouponCode("");
      await fetchCart(); // Re-fetch updated cart after coupon applied
      setSuccessMsg("Coupon applied successfully!");
    } catch {
      setError("Failed to apply coupon.");
    }
  };

  // Proceed to Checkout
  const handleCheckout = () => {
    router.push("/dashboard/checkout");
  };

  if (!cart || cart.cartItem.length === 0) {
    return (
      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-36">
        <h1 className="mb-6 text-center text-3xl font-bold">Your Cart</h1>
        <div className="text-center">Your cart is empty!</div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Cart" />
      <div className="relative mx-auto max-w-4xl px-4 pb-16">
        <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
          Your Cart
        </h1>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="mb-4 text-center text-red-500">{error}</div>}
        {!loading && !error && successMsg && (
          <div className="mb-4 text-center text-primary">{successMsg}</div>
        )}
        <ul className="space-y-4">
          {cart.cartItem.map((item) => (
            <li
              key={item.productId._id}
              className="flex flex-col items-start justify-between space-y-4 rounded-lg border border-gray-300 p-4 shadow-md sm:flex-row sm:items-center sm:space-y-0"
            >
              <div className="flex items-center">
                <Image
                  src="/images/product/painfrei-oil.png"
                  alt={item.productId.title}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    {item.productId.title}
                  </h2>
                  <p className="text-sm text-gray-500 sm:text-base">₹{649.0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  className="rounded border px-2 py-1 sm:px-3 sm:py-2"
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity - 1)
                  }
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span className="text-base font-medium sm:text-lg">
                  {item.quantity}
                </span>
                <button
                  className="rounded border px-2 py-1 sm:px-3 sm:py-2"
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button
                  className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 sm:text-base"
                  onClick={() => handleRemove(item.productId._id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-lg border p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">
            Cart Summary
          </h2>

          {cart.discount > 0 && (
            <p className="text-primary">Discount Applied: {cart.discount}%</p>
          )}

          <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 rounded border p-2"
            />
            <button
              onClick={handleApplyCoupon}
              className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 sm:text-base"
            >
              Apply Coupon
            </button>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-4 w-full rounded bg-blue-600 p-2 text-sm text-white hover:bg-blue-700 sm:text-base"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};
export default Cart;
