"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/navigation";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "carts/",
          { headers: { token: ` ${localStorage.getItem("token")}` } },
        );
        setCart(response.data.cart);
        // console.log("This is the response data cart:" + response.data.cart);
      } catch (err) {
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn]);

  const handleRemove = async (itemId) => {
    try {
      const response = await axios.delete(
        process.env.NEXT_PUBLIC_BACKEND_URL + `carts/${itemId}`, {headers: { token: ` ${localStorage.getItem("token")}` } },
      );
      setCart(response.data.cart);
    } catch (err) {
      setError("Failed to remove item.");
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      const response = await axios.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + `carts/${itemId}`,
        { quantity },
        { headers: { token: ` ${localStorage.getItem("token")}` } },
      );
      console.log("This is the response data cart:" + response.data.cart);
      setCart(response.data.cart);
    } catch (err) {
      console.error(err);
      setError("Failed to update item quantity.");
    }
  };

  const handleApplyCoupon = async () => {
    // try {
    //   const response = await axios.post(
    //     process.env.NEXT_PUBLIC_BACKEND_URL + "carts/apply-coupon",
    //     { code: couponCode },
    //     { headers: { token: ` ${localStorage.getItem("token")}` } },
    //   );
    //   setCart(response.data.cart);
    //   setCouponCode("");
    // } catch (err) {
    //   setError("Failed to apply coupon.");
    // }
    alert("Coming soon!");
  };
  
  const handleCheckout = () => {
     router.push("/dashboard/checkout");
  }
  
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!cart || cart.cartItem.length === 0) {
    return (
      <div className="relative z-10 mx-auto max-w-3xl overflow-hidden px-4 pb-16 pt-36">
        <h1 className="mb-6 text-center text-3xl font-bold">Your Cart</h1>
        <div className="text-center">Your cart is empty!</div>
      </div>
    );
  }

  return (
    <>
    <Breadcrumb pageName="Orders"/>
    <div className="relative z-10 mx-auto max-w-3xl overflow-hidden px-4 pb-16">
      <h1 className="mb-6 text-center text-3xl font-bold">Your Cart</h1>

      <ul className="space-y-4">
        {cart.cartItem.map((item) => (
          <li
            key={item.productId._id}
            className="flex items-center justify-between rounded-lg border border-gray-300 p-4 shadow-md"
          >
            <div className="flex items-center">
              <img
                src={item.productId.imgCover}
                alt={item.productId.title}
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
                className="rounded bg-red-600 px-4 py-2 text-white transition duration-300 hover:bg-red-700"
                onClick={() => handleRemove(item.productId._id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-lg border border-gray-300 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Cart Summary</h2>
        <p>Total Price: ${cart.totalPrice}</p>
        {cart.discount > 0 && (
          <p className="text-green-600">Discount Applied: {cart.discount}%</p>
        )}

        <div className="mt-4">
          
          <button
            className="mt-2 w-full rounded bg-blue-600 p-2 text-white transition hover:bg-blue-700"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Cart;
