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
        { headers: { token: `${localStorage.getItem("token")}` } }
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
     const response =  await axios.delete(
        process.env.NEXT_PUBLIC_BACKEND_URL + `carts/${itemId}`,
        { headers: { token: `${localStorage.getItem("token")}` } }
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
        { headers: { token: `${localStorage.getItem("token")}` } }
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
        { headers: { token: `${localStorage.getItem("token")}` } }
      );
      setCart(response.data.cart);
      setCouponCode("");
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
      <div className="relative mx-auto max-w-3xl px-4 pb-16">
        <h1 className="mb-6 text-center text-3xl font-bold">Your Cart</h1>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}
        {!loading && !error && successMsg && (
          <div className="text-center text-green-500 mb-4">{successMsg}</div>
        )}
        <ul className="space-y-4">
          {cart.cartItem.map((item) => (
            <li
              key={item.productId._id}
              className="flex items-center justify-between rounded-lg border border-gray-300 p-4 shadow-md"
            >
              <div className="flex items-center">
                <Image
                  src={item.productId.imgCover}
                  alt={item.productId.title}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">
                    {item.productId.title}
                  </h2>
                  <p className="text-sm text-gray-500">$ {item.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="rounded border px-2 py-1"
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity - 1)
                  }
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="rounded border px-2 py-1"
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  onClick={() => handleRemove(item.productId._id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-lg border p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Cart Summary</h2>
          <p>Total Price: ₹{cart.totalPrice}</p>
          {cart.discount > 0 && (
            <p className="text-green-600">
              Discount Applied: {cart.discount}%
            </p>
          )}

          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 rounded border p-2"
            />
            <button
              onClick={handleApplyCoupon}
              className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
            >
              Apply Coupon
            </button>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-4 w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
